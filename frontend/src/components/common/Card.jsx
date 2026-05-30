import { forwardRef } from 'react'

const Card = forwardRef(
  (
    {
      children,
      header,
      footer,
      variant = 'default',
      hover = false,
      padding = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl transition-all duration-300 ease-out'

    const variants = {
      default: `
        bg-gradient-to-br from-white/[0.08] to-white/[0.03]
        backdrop-blur-xl border border-white/[0.10]
        shadow-lg shadow-black/10
      `,
      solid: `
        bg-gray-900 border border-gray-800
      `,
      gradient: `
        bg-gradient-to-br from-indigo-500/10 to-purple-500/10
        border border-indigo-500/20
        backdrop-blur-xl
      `,
      outline: `
        border border-white/[0.10] bg-transparent
        backdrop-blur-sm
      `,
      elevated: `
        bg-gradient-to-br from-white/[0.08] to-white/[0.03]
        backdrop-blur-xl border border-white/[0.10]
        shadow-xl shadow-black/20
      `,
    }

    const hoverStyles = hover
      ? `
        hover:border-white/[0.18]
        hover:shadow-xl hover:shadow-indigo-500/[0.06]
        hover:scale-[1.015]
        cursor-pointer
      `
      : ''

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant] || variants.default}
          ${hoverStyles}
          ${padding ? 'p-6' : ''}
          ${className}
        `}
        {...props}
      >
        {header && (
          <div className="mb-4 pb-4 border-b border-white/[0.08]">
            {typeof header === 'string' ? (
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {header}
              </h3>
            ) : (
              header
            )}
          </div>
        )}
        {children}
        {footer && (
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
