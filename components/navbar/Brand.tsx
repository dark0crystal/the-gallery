'use client'

import { Link } from '@/i18n/navigation'

interface BrandProps {
  isScrolled?: boolean
}

export function Brand({ isScrolled = false }: BrandProps) {
  return (
    <Link href="/" className="flex items-center space-x-2 transition-opacity duration-300 hover:opacity-80">
      <span className={`text-xl font-semibold transition-colors duration-300 ${
        isScrolled ? 'text-white' : 'text-gray-900'
      }`}>
        ذا جاليري
      </span>
    </Link>
  )
}

