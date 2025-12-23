'use client'

import React from 'react'
import { Toast as ToastComp } from './Toast'

interface ToastItem {
  id: string
  message: React.ReactNode
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface Props {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: Props) {
  const visible = toasts.slice(0, 5)

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-[520px] px-4 pointer-events-none">
      {visible.map((t) => (
        <ToastComp key={t.id} id={t.id} message={t.message} type={t.type} duration={t.duration} onClose={onRemove} />
      ))}
    </div>
  )
}
