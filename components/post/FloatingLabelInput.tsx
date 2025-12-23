'use client'

import { useState, useRef, useEffect } from 'react'

interface FloatingLabelInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea'
  placeholder?: string
  maxLength?: number
  required?: boolean
  error?: string
  rows?: number
  className?: string
}

export function FloatingLabelInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
  required = false,
  error,
  rows = 4,
  className = '',
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const isActive = isFocused || value.length > 0

  const inputClasses = `
    w-full px-4 pt-6 pb-2 border rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `

  const labelClasses = `
    absolute right-4 transition-all duration-200 pointer-events-none
    ${isActive 
      ? 'top-2 text-xs text-blue-600 font-medium' 
      : 'top-4 text-base text-gray-500'
    }
    ${error && isActive ? 'text-red-600' : ''}
  `

  return (
    <div className="relative">
      {type === 'textarea' ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isActive ? placeholder : undefined}
          maxLength={maxLength}
          required={required}
          rows={rows}
          className={inputClasses}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isActive ? placeholder : undefined}
          maxLength={maxLength}
          required={required}
          className={inputClasses}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {maxLength && (
        <div className="absolute left-4 bottom-2 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

