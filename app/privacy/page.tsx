import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'VolleyPlanner privacy policy: how we collect, use, and protect your data in accordance with UK GDPR.',
  alternates: {
    canonical: 'https://volleyplanner.co.uk/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-vp-muted hover:text-vp-text transition-colors duration-150 mb-10"
      >
        &larr; Back to home
      </Link>

      <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl text-vp-text leading-[0.92] tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p className="text-vp-muted text-sm mb-12">Last updated: March 2025</p>

      <div className="prose prose-sm max-w-none space-y-10 text-vp-muted leading-relaxed">

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">1. Who we are</h2>
          <p>
            VolleyPlanner (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a web application at{' '}
            <span className="text-vp-text">volleyplanner.co.uk</span> that helps volleyball coaches
            plan training sessions. We are based in the United Kingdom.
          </p>
          <p className="mt-3">
            For questions about this policy, contact us at{' '}
            <a href="mailto:hello@volleyplanner.co.uk" className="text-orange hover:underline">
              hello@volleyplanner.co.uk
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">2. What data we collect</h2>
          <p>We collect only what is necessary to provide the service:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <span className="text-vp-text">Email address</span> - used to create and authenticate
              your account via magic link. We do not store or use passwords.
            </li>
            <li>
              <span className="text-vp-text">Session plan content</span> - the descriptions you
              enter and the plans we generate are saved to your account if you are signed in.
            </li>
            <li>
              <span className="text-vp-text">Usage data</span> - we track how many plans you have
              generated this month to enforce free-tier limits.
            </li>
            <li>
              <span className="text-vp-text">Payment information</span> - if you subscribe to Pro,
              payment is handled by Stripe. We do not store card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">3. How we use your data</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>To create and manage your account</li>
            <li>To generate and save session plans on your behalf</li>
            <li>To enforce usage limits on the free tier</li>
            <li>To process Pro subscription payments via Stripe</li>
            <li>To send transactional emails (sign-in links only - no marketing)</li>
          </ul>
          <p className="mt-3">
            We do not sell your data. We do not use your data for advertising. We do not use your
            session plans to train AI models.
          </p>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">4. Legal basis (UK GDPR)</h2>
          <p>We process your data under the following lawful bases:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <span className="text-vp-text">Contract</span> - processing necessary to provide the
              service you have requested (account creation, plan generation, billing).
            </li>
            <li>
              <span className="text-vp-text">Legitimate interests</span> - basic service analytics
              to maintain and improve the application.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">5. Third-party services</h2>
          <p>We use the following services to operate VolleyPlanner:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <span className="text-vp-text">Supabase</span> - database and authentication (EU data
              residency)
            </li>
            <li>
              <span className="text-vp-text">Anthropic</span> - AI plan generation. Your session
              descriptions are sent to Anthropic&apos;s API to generate plans.
            </li>
            <li>
              <span className="text-vp-text">Stripe</span> - payment processing for Pro
              subscriptions
            </li>
            <li>
              <span className="text-vp-text">Vercel</span> - application hosting
            </li>
          </ul>
          <p className="mt-3">
            Each service operates under its own privacy policy and data processing agreement. We
            ensure any third party we use provides adequate protection for your data.
          </p>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">6. Data retention</h2>
          <p>
            Your account and saved plans are retained for as long as you have an active account.
            If you delete your account, we will delete your personal data within 30 days, except
            where we are required to retain it for legal or financial reasons (for example,
            billing records).
          </p>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">7. Your rights</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability (receive your data in a machine-readable format)</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@volleyplanner.co.uk" className="text-orange hover:underline">
              hello@volleyplanner.co.uk
            </a>
            . We will respond within 30 days.
          </p>
          <p className="mt-3">
            You also have the right to complain to the Information Commissioner&apos;s Office (ICO)
            at{' '}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:underline"
            >
              ico.org.uk
            </a>{' '}
            if you believe we have not handled your data correctly.
          </p>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">8. Cookies</h2>
          <p>
            We use a session cookie to keep you signed in. This is strictly necessary for the
            service to function and does not require consent. We do not use tracking or advertising
            cookies.
          </p>
        </section>

        <section>
          <h2 className="text-vp-text font-semibold text-base mb-3">9. Changes to this policy</h2>
          <p>
            If we make material changes to this policy, we will update the date at the top of this
            page. Continued use of VolleyPlanner after changes constitutes acceptance of the updated
            policy.
          </p>
        </section>

      </div>
    </div>
  )
}
