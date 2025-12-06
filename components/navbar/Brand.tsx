'use client'

import { Link } from '@/i18n/navigation'

export function Brand() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        ذا جاليري
      </span>
    </Link>
  )
}

