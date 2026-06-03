import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
}) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      // Focus the modal on open for accessibility
      const timer = setTimeout(() => {
        modalRef.current?.focus()
      }, 50)

      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{ maxHeight: '90vh' }}
        className={`
          w-full ${sizes[size]}
          bg-gradient-to-br from-white/[0.08] to-white/[0.03]
          backdrop-blur-2xl
          rounded-2xl
          shadow-2xl shadow-black/30
          border border-white/[0.12]
          animate-slide-up
          focus:outline-none
          flex flex-col
          overflow-hidden
          ${className}
        `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5 shrink-0">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold tracking-tight text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="
                  p-2 rounded-xl text-gray-400
                  hover:text-white hover:bg-white/[0.08]
                  active:scale-90
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-indigo-500/50
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-gray-900
                  ml-auto
                "
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto scrollbar-thin flex-1 min-h-0">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
