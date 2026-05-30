import { forwardRef } from 'react'

const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      iconPosition = 'left',
      type = 'text',
      placeholder,
      helperText,
      className = '',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const renderIcon = (iconProp) => {
      if (!iconProp) return null
      // If icon is a React element (e.g. lucide-react), render it directly
      if (typeof iconProp === 'object') {
        return iconProp
      }
      // If icon is a string (legacy FA class), render as text fallback
      if (typeof iconProp === 'string') {
        return <span className="text-gray-500 text-sm">•</span>
      }
      return null
    }

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              {renderIcon(icon)}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full py-3 px-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20
              ${icon && iconPosition === 'left' ? 'pl-11' : ''}
              ${icon && iconPosition === 'right' ? 'pr-11' : ''}
              ${error ? 'border-red-500/50 focus:ring-red-500/40 focus:border-red-500/50' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
              {renderIcon(icon)}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
