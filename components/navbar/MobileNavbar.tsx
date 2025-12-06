'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface NavItem {
  name: string
  href: string
}

interface MobileNavbarProps {
  isOpen: boolean
  onToggle: () => void
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

export function MobileNavbar({
  isOpen,
  onToggle,
  navigation,
  isActive,
  session,
}: MobileNavbarProps) {
  const t = useTranslations('common')

  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  )
}

export function MobileMenu({
  isOpen,
  onClose,
  navigation,
  isActive,
  session,
}: {
  isOpen: boolean
  onClose: () => void
  navigation: NavItem[]
  isActive: (href: string) => boolean
  session: MobileNavbarProps['session']
}) {
  const t = useTranslations('common')

  if (!isOpen) return null

  return (
    <div className="md:hidden border-t border-gray-300 py-4 bg-[#f9f5ec]">
      <div className="flex flex-col space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {item.name}
          </Link>
        ))}
        {!session && (
          <Link
            href="/auth/signin"
            onClick={onClose}
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center"
          >
            {t('signIn')}
          </Link>
        )}
      </div>
    </div>
  )
}

