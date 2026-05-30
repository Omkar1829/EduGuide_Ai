import { forwardRef } from 'react'
import Spinner from './Spinner'

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold tracking-tight
      rounded-xl transition-all duration-300 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      focus-visible:ring-offset-gray-950
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      select-none
    `

    const variants = {
      primary: `
        bg-gradient-to-r from-indigo-500 to-purple-500 text-white
        hover:from-indigo-600 hover:to-purple-600
        shadow-lg shadow-indigo-500/25
        hover:shadow-xl hover:shadow-indigo-500/35
        hover:scale-[1.02]
        active:scale-[0.97]
        focus-visible:ring-indigo-500
      `,
      secondary: `
        bg-white/[0.05] text-white border border-white/[0.10]
        hover:bg-white/[0.10] hover:border-white/[0.18]
        hover:shadow-lg hover:shadow-white/5
        active:scale-[0.97]
        focus-visible:ring-white/30
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-rose-500 text-white
        hover:from-red-600 hover:to-rose-600
        shadow-lg shadow-red-500/25
        hover:shadow-xl hover:shadow-red-500/35
        hover:scale-[1.02]
        active:scale-[0.97]
        focus-visible:ring-red-500
      `,
      ghost: `
        text-gray-400 hover:text-white hover:bg-white/[0.05]
        active:scale-[0.97]
        focus-visible:ring-white/20
      `,
      outline: `
        border-2 border-indigo-500/50 text-indigo-400
        hover:bg-indigo-500/10 hover:border-indigo-500/70
        hover:text-indigo-300
        active:scale-[0.97]
        focus-visible:ring-indigo-500
      `,
      success: `
        bg-gradient-to-r from-emerald-500 to-teal-500 text-white
        hover:from-emerald-600 hover:to-teal-600
        shadow-lg shadow-emerald-500/25
        hover:shadow-xl hover:shadow-emerald-500/35
        hover:scale-[1.02]
        active:scale-[0.97]
        focus-visible:ring-emerald-500
      `,
    }

    const sizes = {
      sm: 'px-3.5 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
      xl: 'px-8 py-4 text-lg gap-3',
    }

    const iconOnly = {
      sm: 'p-1.5',
      md: 'p-2.5',
      lg: 'p-3',
      xl: 'p-4',
    }

    const isIconOnly = icon && !children

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant] || variants.primary}
          ${isIconOnly ? iconOnly[size] : sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'sm' || size === 'md' ? 'sm' : 'md'} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0 flex items-center">{icon}</span>
            )}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0 flex items-center">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
