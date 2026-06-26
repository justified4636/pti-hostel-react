import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = '') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className={`toast show ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}
