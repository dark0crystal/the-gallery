'use client'

import { useCallback } from 'react'
import { useToastContext } from '@/contexts/ToastContext'

export function useToast() {
  const { showToast, showSuccess, showError, showInfo, showWarning } = useToastContext()

  const show = useCallback((message: React.ReactNode, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => {
    return showToast(message, type, duration)
  }, [showToast])

  const success = useCallback((message: React.ReactNode, duration?: number) => showSuccess(message, duration), [showSuccess])
  const error = useCallback((message: React.ReactNode, duration?: number) => showError(message, duration), [showError])
  const info = useCallback((message: React.ReactNode, duration?: number) => showInfo(message, duration), [showInfo])
  const warning = useCallback((message: React.ReactNode, duration?: number) => showWarning(message, duration), [showWarning])

  return { show, success, error, info, warning }
}
