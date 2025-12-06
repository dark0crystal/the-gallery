'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface NavItem {
  name: string
  href: string
}

interface NavLinksProps {
  navigation: NavItem[]
  isActive: (href: string) => boolean
  session: {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      username?: string | null
    }
  } | null
}

export function NavLinks({ navigation, isActive, session }: NavLinksProps) {
  const t = useTranslations('common')

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(item.href)
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

