'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Drawer } from 'vaul'
import { X, ArrowRight, Loader2 } from 'lucide-react'
import { SessionForm } from './SessionForm'

interface NewPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FORM_ID = 'new-plan-modal-form'

function ModalInner({ onClose, hideSubmit = false }: { onClose: () => void; hideSubmit?: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">
            New session
          </p>
          <h2 className="font-display font-bold uppercase text-3xl text-vp-text leading-[0.92] tracking-tight">
            Build your plan
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded-md text-vp-muted hover:text-vp-text hover:bg-vp-surface-2 transition-colors duration-150"
        >
          <X size={18} />
        </button>
      </div>
      <SessionForm formId={FORM_ID} hideSubmit={hideSubmit} />
    </>
  )
}

export function NewPlanModal({ open, onOpenChange }: NewPlanModalProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Mobile — Vaul bottom sheet with sticky footer button
  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-vp-surface border-t border-vp-border rounded-t-2xl min-h-[60dvh] max-h-[92dvh] focus:outline-none"
            aria-describedby={undefined}
          >
            <Drawer.Title className="sr-only">New session plan</Drawer.Title>

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-vp-border rounded-full" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 pt-4 pb-2 flex-1">
              <ModalInner onClose={() => onOpenChange(false)} hideSubmit />
            </div>

            {/* Sticky footer — button lives outside the card border */}
            <div className="shrink-0 px-6 py-4 border-t border-vp-border bg-vp-surface">
              <button
                type="submit"
                form={FORM_ID}
                className="w-full flex items-center justify-center gap-2 bg-orange text-white px-4 py-3.5 rounded-md text-sm font-semibold hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
              >
                <ArrowRight size={16} />
                Generate plan
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  // Desktop — Radix Dialog (button stays inside the form)
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl bg-vp-surface border border-vp-border rounded-2xl p-10 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">New session plan</Dialog.Title>
          <ModalInner onClose={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
