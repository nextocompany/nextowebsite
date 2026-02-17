import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-full
        border border-neutral-200
        bg-white text-neutral-900
        px-6 py-2
        text-sm font-medium
        transition-colors duration-150
        hover:bg-neutral-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
