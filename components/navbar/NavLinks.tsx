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
  isScrolled: boolean
}

export function NavLinks({ navigation, isActive, session, isScrolled }: NavLinksProps) {
  const t = useTranslations('common')

  return (
    <div className="hidden md:flex items-center space-x-8">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
            isActive(item.href)
              ? isScrolled
                ? 'text-white border-b-2 border-white'
                : 'text-gray-900 border-b-2 border-gray-900'
              : isScrolled
                ? 'text-white/80 hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

