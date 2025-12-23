'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '@/components/ui/ToastContainer'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  message: React.ReactNode
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  showToast: (message: React.ReactNode, type?: ToastType, duration?: number) => string
  removeToast: (id: string) => void
  showSuccess: (message: React.ReactNode, duration?: number) => string
  showError: (message: React.ReactNode, duration?: number) => string
  showInfo: (message: React.ReactNode, duration?: number) => string
  showWarning: (message: React.ReactNode, duration?: number) => string
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: React.ReactNode, type: ToastType = 'info', duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [{ id, message, type, duration }, ...prev].slice(0, 20))
    return id
  }, [])

  const showSuccess = (message: React.ReactNode, duration?: number) => showToast(message, 'success', duration)
  const showError = (message: React.ReactNode, duration?: number) => showToast(message, 'error', duration)
  const showInfo = (message: React.ReactNode, duration?: number) => showToast(message, 'info', duration)
  const showWarning = (message: React.ReactNode, duration?: number) => showToast(message, 'warning', duration)

  return (
    <ToastContext.Provider value={{ showToast, removeToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within a ToastProvider')
  return ctx
}
