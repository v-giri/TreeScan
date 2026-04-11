import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

const typeConfig = {
  success: { icon: CheckCircle, stripe: 'bg-sage-deep', iconColor: 'text-sage-deep' },
  error: { icon: XCircle, stripe: 'bg-[#D95555]', iconColor: 'text-[#D95555]' },
  warning: { icon: AlertTriangle, stripe: 'bg-[#E0A030]', iconColor: 'text-[#E0A030]' },
  info: { icon: Info, stripe: 'bg-sage', iconColor: 'text-sage' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    timeoutRefs.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    clearTimeout(timeoutRefs.current[id])
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 max-w-[390px] mx-auto px-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => {
            const { icon: Icon, stripe, iconColor } = typeConfig[toast.type]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-[16px] shadow-card-lg flex overflow-hidden"
              >
                <div className={`w-1 ${stripe} flex-shrink-0`} />
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <Icon size={18} className={iconColor} />
                  <p className="text-sm text-plant-dark font-medium flex-1">{toast.message}</p>
                  <button onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
                    <X size={14} className="text-plant-light" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
