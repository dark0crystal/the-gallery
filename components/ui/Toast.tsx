'use client'

import React, { useEffect, useState } from 'react'


type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  id: string
  message: React.ReactNode
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1" />
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 9h.01" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
    </svg>
  ),
}

const BG: Record<ToastType, string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-sky-500 text-white',
  warning: 'bg-amber-500 text-white',
}

export function Toast({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setClosing(true)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(t)
  }, [duration, id, onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto w-full max-w-md shadow-lg rounded-lg overflow-hidden transform transition-all ease-out duration-300 ${closing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
    >
      <div className={`flex items-start gap-3 p-4 ${BG[type]}`}>
        <div className="shrink-0">{ICONS[type]}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          aria-label="Dismiss notification"
          onClick={() => {
            setClosing(true)
            setTimeout(() => onClose(id), 200)
          }}
          className="ml-3 text-white opacity-80 hover:opacity-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
