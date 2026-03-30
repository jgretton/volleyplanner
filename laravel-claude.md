# VolleyPlanner — Laravel Build Plan

This document outlines how VolleyPlanner would be built from scratch using the Laravel stack. It is a planning reference, not the active codebase.

---

## Stack

| Layer           | Choice                                                         |
| --------------- | -------------------------------------------------------------- |
| Framework       | Laravel 12, PHP 8.3                                            |
| Frontend        | Inertia.js 2.0 + React 19 + TypeScript                         |
| Styling         | Tailwind CSS v4                                                |
| Database        | PostgreSQL (Railway addon)                                     |
| Auth            | Laravel Fortify (magic link / passwordless)                    |
| Payments        | Laravel Cashier (Stripe)                                       |
| AI              | `laravel/ai` (official first-party) — Anthropic provider       |
| PDF             | Spatie Laravel PDF (Browsershot / Chromium)                    |
| Queues          | Redis (Railway addon) + Laravel Queue                          |
| WebSockets      | Laravel Reverb (if real-time needed)                           |
| Deployment      | Railway                                                        |
| Starter kit     | Reactor (Inertia + React + TypeScript + Radix UI + Tailwind)   |

### UI Libraries (same as Next.js version — React is React)

| Library                         | Purpose                              |
| ------------------------------- | ------------------------------------ |
| `@radix-ui/react-dialog`        | Desktop modal dialogs                |
| `vaul`                          | Mobile bottom sheet drawers          |
| `sonner`                        | Toast notifications                  |
| `lucide-react`                  | Icons                                |
| `tailwind-merge` + `clsx`       | Class merging via `cn()` utility     |

---

## Why This Stack

- **Eloquent + Spatie Permissions** — team membership, role-based drill sharing, club libraries are complex many-to-many relational patterns. Eloquent handles them more ergonomically than Prisma/Supabase RLS at scale.
- **Laravel Cashier** — subscription billing, webhooks, invoice PDFs, customer portal all built-in. Weeks of avoided work vs assembling Stripe manually.
- **Spatie Laravel PDF** — server-side Chromium rendering. Plans look identical in PDF to the browser. Far superior to jsPDF + html2canvas.
- **`laravel/ai`** — official first-party package, Anthropic is a named supported provider, structured output supported. Maintained by the Laravel core team.
- **Queue workers and scheduled tasks** — native in Laravel. Usage resets, background AI jobs, email notifications all handled cleanly. Railway supports long-running processes natively.
- **Railway deployment** — ~$8–15/month at low traffic on Hobby plan. Supports web service + queue worker + cron + PostgreSQL + Redis.

---

## Project Structure

```
app/
  Http/
    Controllers/
      Auth/           # Fortify magic link controllers
      PlanController.ts
      DrillController.ts
      DashboardController.ts
      BillingController.ts
    Middleware/
  Models/
    User.php
    Plan.php
    Drill.php          # Shared drill library (v2)
    Team.php           # v2
    TeamMember.php     # v2 pivot
  Services/
    PlanGeneratorService.php    # All AI generation logic
    DiagramService.php          # SVG diagram generation
  Agents/
    SessionPlanAgent.php        # laravel/ai Agent class
resources/
  js/
    Pages/
      Home.tsx
      Plan/
        Show.tsx        # Full + session view
        Index.tsx       # Plan generation page
      Dashboard/
        Index.tsx
        Billing.tsx
      Auth/
        SignIn.tsx
    Components/
      plan/
        DrillCard.tsx
        DrillModal.tsx
        CompactView.tsx
        PlanView.tsx
        TimelineBar.tsx
        DrillDiagram.tsx
        PlanSkeleton.tsx
      ui/
        Button.tsx
        Badge.tsx
        Card.tsx
        Skeleton.tsx
        ScrollToTop.tsx
      layout/
        Navbar.tsx
        Footer.tsx
  views/
    app.blade.php       # Inertia root template
database/
  migrations/
routes/
  web.php
  api.php
config/
  ai.php               # laravel/ai config
```

---

## Database Schema

### `users`
Standard Laravel users table + additions:
- `id` uuid
- `email` string unique
- `email_verified_at` timestamp nullable
- `stripe_id` string nullable
- `pm_type`, `pm_last_four` — Cashier columns
- `subscribed` boolean — Cashier manages
- `plans_used_this_month` integer default 0
- `plans_reset_at` timestamp
- timestamps

### `plans`
- `id` uuid
- `user_id` uuid FK → users
- `title` string
- `input_data` json (players, duration, level, description)
- `plan_data` json (full generated plan)
- `liked` boolean default false
- timestamps

### `drill_feedback`
- `id` uuid
- `user_id` uuid FK → users
- `plan_id` uuid FK → plans
- `drill_index` integer
- `drill_name` string
- `drill_type` string
- `feedback` enum('liked', 'disliked')
- timestamps

### Future (v2 — teams)
```
teams
  id, name, slug, owner_id, created_at

team_members (pivot)
  team_id, user_id, role enum('owner','coach','viewer'), joined_at

drills (shared library)
  id, team_id nullable, user_id, name, phase, data json, is_public, created_at

plan_shares
  id, plan_id, token string unique, expires_at nullable
```

---

## AI Integration — `laravel/ai`

### Installation
```bash
composer require laravel/ai
php artisan vendor:publish --tag=ai-config
```

### Config (`config/ai.php`)
```php
'default' => 'anthropic',

'providers' => [
    'anthropic' => [
        'driver' => 'anthropic',
        'key' => env('ANTHROPIC_API_KEY'),
    ],
],
```

### Session Plan Agent

```php
<?php

namespace App\Agents;

use Laravel\AI\Agent;
use Laravel\AI\Attributes\Provider;
use Laravel\AI\Attributes\Model;
use Laravel\AI\Contracts\HasStructuredOutput;

#[Provider('anthropic')]
#[Model('claude-haiku-4-5-20251001')]
class SessionPlanAgent extends Agent implements HasStructuredOutput
{
    public function instructions(): string
    {
        return 'You are an expert volleyball coaching assistant. Generate structured, practical training sessions tailored to the coach\'s squad. Prioritise maximising touches, progressive skill development, and realistic timing.';
    }

    public function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'title'          => ['type' => 'string'],
                'overview'       => ['type' => 'string'],
                'total_duration' => ['type' => 'integer'],
                'player_count'   => ['type' => 'integer'],
                'level'          => ['type' => 'string', 'enum' => ['beginner', 'intermediate', 'advanced', 'mixed']],
                'focus'          => ['type' => 'string'],
                'timeline'       => ['type' => 'array', 'items' => ['type' => 'object']],
                'drills'         => ['type' => 'array', 'items' => ['type' => 'object']],
                'session_notes'  => ['type' => 'string'],
            ],
            'required' => ['title', 'overview', 'total_duration', 'player_count', 'level', 'focus', 'timeline', 'drills', 'session_notes'],
        ];
    }
}
```

### Plan Generator Service

```php
<?php

namespace App\Services;

use App\Agents\SessionPlanAgent;

class PlanGeneratorService
{
    public function generate(array $inputs, array $likedDrills = []): array
    {
        $prompt = $this->buildPrompt($inputs, $likedDrills);

        $response = (new SessionPlanAgent)->prompt($prompt);

        return $response->structured();
    }

    private function buildPrompt(array $inputs, array $likedDrills): string
    {
        // Same prompt logic as lib/claude.ts
    }
}
```

---

## Auth — Magic Link (Passwordless)

Laravel Fortify supports passwordless login via a custom implementation.

```php
// routes/web.php
Route::get('/signin', [MagicLinkController::class, 'show'])->name('signin');
Route::post('/signin', [MagicLinkController::class, 'send'])->name('signin.send');
Route::get('/auth/callback/{token}', [MagicLinkController::class, 'authenticate'])->name('auth.callback');
```

```php
// MagicLinkController
public function send(Request $request)
{
    $request->validate(['email' => 'required|email']);

    // Always return the same response (user enumeration prevention)
    $user = User::firstOrCreate(['email' => $request->email]);

    $token = Str::random(64);
    Cache::put("magic_link:{$token}", $user->id, now()->addHour());

    Mail::to($user)->send(new MagicLinkMail($token));

    return back()->with('status', 'check-email');
}

public function authenticate(Request $request, string $token)
{
    $userId = Cache::pull("magic_link:{$token}");

    if (!$userId) {
        return redirect()->route('signin')->withErrors(['token' => 'This link has expired.']);
    }

    $user = User::findOrFail($userId);
    Auth::login($user, remember: true);

    // Always redirect to hardcoded path — never dynamic
    return redirect()->route('plan.index');
}
```

---

## Payments — Laravel Cashier

```bash
composer require laravel/cashier
php artisan cashier:install
php artisan migrate
```

```php
// User model
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

```php
// Checkout
public function subscribe(Request $request)
{
    return $request->user()
        ->newSubscription('default', config('cashier.price_id'))
        ->checkout([
            'success_url' => route('dashboard'),
            'cancel_url'  => route('dashboard.billing'),
        ]);
}

// Billing portal
public function portal(Request $request)
{
    return $request->user()->redirectToBillingPortal(route('dashboard.billing'));
}
```

```php
// Webhook route (routes/web.php)
Route::webhooks('/stripe/webhook', 'cashier-webhook');
```

Usage check middleware:
```php
if (!$user->subscribed() && $user->plans_used_this_month >= 3) {
    return response()->json(['error' => 'limit_reached'], 402);
}
```

---

## PDF Export — Spatie Laravel PDF

```bash
composer require spatie/laravel-pdf
```

```php
// PlanController
public function pdf(Plan $plan)
{
    $this->authorize('view', $plan);

    return Pdf::view('pdf.plan', ['plan' => $plan->plan_data])
        ->format('a4')
        ->download("session-plan-{$plan->id}.pdf");
}
```

```blade
{{-- resources/views/pdf/plan.blade.php --}}
{{-- Tailwind-styled plan layout — identical to browser view --}}
```

---

## Inertia + TypeScript

### Type-safe PHP → TypeScript

Install `laravel-typescript-transformer` by Spatie:

```bash
composer require spatie/laravel-typescript-transformer
php artisan vendor:publish --tag=typescript-transformer-config
php artisan typescript:transform
```

This generates TypeScript types from PHP classes/DTOs automatically, keeping the boundary type-safe.

### Page Props Pattern

```php
// PlanController
public function show(Plan $plan): Response
{
    return Inertia::render('Plan/Show', [
        'plan'   => PlanResource::make($plan),
        'isPro'  => $request->user()->subscribed(),
    ]);
}
```

```tsx
// Pages/Plan/Show.tsx
interface Props {
  plan: SessionPlan
  isPro: boolean
}

export default function PlanShow({ plan, isPro }: Props) {
  // Same React components as Next.js version
}
```

---

## Railway Deployment

### `railway.toml`

```toml
[build]
builder = "nixpacks"

[[services]]
name = "web"
startCommand = "php artisan serve --host=0.0.0.0 --port=$PORT"

[[services]]
name = "worker"
startCommand = "php artisan queue:work redis --sleep=3 --tries=3"

[[services]]
name = "scheduler"
startCommand = "php artisan schedule:work"
```

### Environment Variables

```
APP_KEY=
APP_ENV=production
APP_URL=https://your-domain.com

DB_CONNECTION=pgsql
DATABASE_URL=${{Postgres.DATABASE_URL}}

REDIS_URL=${{Redis.REDIS_URL}}

ANTHROPIC_API_KEY=
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

MAIL_MAILER=smtp
# mail config for magic links
```

### Nixpacks auto-detects Laravel and configures:
- PHP 8.3 + extensions (pdo_pgsql, redis, gd)
- Composer install
- `php artisan migrate --force` on deploy

---

## Scheduled Tasks

```php
// app/Console/Kernel.php (or routes/console.php in Laravel 12)

Schedule::call(function () {
    User::where('plans_reset_at', '<=', now())
        ->update([
            'plans_used_this_month' => 0,
            'plans_reset_at' => now()->startOfMonth()->addMonth(),
        ]);
})->monthlyOn(1, '00:00')->name('reset-monthly-plans');
```

---

## Implementation Order

Build in this order — do not skip ahead:

1. **Project setup** — `laravel new volleyplanner --kit=react` (Reactor), configure Tailwind v4, install UI libraries, Railway PostgreSQL + Redis connected
2. **Database migrations** — users, plans, drill_feedback tables
3. **Auth** — magic link implementation, middleware, redirect conventions
4. **Homepage** — static, SessionForm, same design as current app
5. **AI integration** — `laravel/ai` config, SessionPlanAgent, PlanGeneratorService
6. **Plan generation** — PlanController, plan generation page, skeleton loading
7. **Plan display** — full view, session view, DrillModal (same React components)
8. **SVG diagram system** — port DiagramService from TypeScript
9. **Dashboard** — saved plans, liked plans, search, filter
10. **Stripe / Cashier** — subscription checkout, billing portal, webhook, usage limits
11. **Pro features** — regenerate drill, swap drill, coach notes
12. **PDF export** — Spatie Laravel PDF, Blade template
13. **Share via link** — plan_shares table, public plan viewer
14. **Teams (v2)** — team creation, invitations, shared drill library, Spatie Permissions
15. **Vercel → Railway migration** — DNS, environment variables, SSL

---

## Key Differences from Next.js Version

| Concern | Next.js (current) | Laravel (this plan) |
|---|---|---|
| AI SDK | Anthropic TS SDK (primary) | `laravel/ai` (first-party, Anthropic supported) |
| Auth | Supabase magic link | Custom magic link via Fortify |
| ORM | Prisma/Supabase client | Eloquent |
| Billing | Manual Stripe assembly | Laravel Cashier |
| PDF | jsPDF + html2canvas | Spatie PDF (Chromium) |
| Teams (v2) | Supabase RLS (complex) | Eloquent + Spatie Permissions (clean) |
| Background jobs | Vercel Cron | Laravel Queue on Redis |
| TypeScript | End-to-end native | Inertia + TS transformer (workable gap) |
| Deployment | Vercel | Railway (~$8–15/month) |
| Frontend UI | Same React components | Same React components via Inertia |

---

## What Stays the Same

- Entire React component library (DrillCard, DrillModal, CompactView, PlanView, TimelineBar etc.)
- Tailwind v4 design system and CSS custom properties
- Radix UI, Vaul, Sonner, Lucide
- All colour tokens, typography, component conventions from CLAUDE.md
- The three plan views (full, session, print)
- Court diagram SVG system (port from TypeScript to PHP, same output)
- Claude model: `claude-haiku-4-5-20251001`
- Prompt logic (port from `lib/claude.ts` to `PlanGeneratorService`)
