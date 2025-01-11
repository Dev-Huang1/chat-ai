import { useState, useCallback } from 'react'

interface ToastProps {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    setToasts((currentToasts) => [...currentToasts, { title, description, variant }])
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.slice(1))
    }, 3000)
  }, [])

  return { toast, toasts }
}

