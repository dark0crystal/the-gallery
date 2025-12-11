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
  isScrolled?: boolean
}

export function MobileNavbar({
  isOpen,
  onToggle,
  navigation,
  isActive,
  session,
  isScrolled = false,
}: MobileNavbarProps) {
  const t = useTranslations('common')

  return (
    <button
      onClick={onToggle}
      className={`md:hidden p-2 rounded-md transition-colors ${
        isScrolled
          ? 'text-white hover:bg-white/10'
          : 'text-gray-900 hover:bg-white/20'
      }`}
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
  isScrolled = false,
}: {
  isOpen: boolean
  onClose: () => void
  navigation: NavItem[]
  isActive: (href: string) => boolean
  session: MobileNavbarProps['session']
  isScrolled?: boolean
}) {
  const t = useTranslations('common')

  if (!isOpen) return null

  return (
    <div className={`md:hidden border-t py-4 transition-all duration-300 ${
      isScrolled
        ? 'border-[#1B4D3E]/80 bg-[#1B4D3E] backdrop-blur-md rounded-b-full'
        : 'border-gray-300/50 bg-white/80 backdrop-blur-md'
    }`}>
      <div className="flex flex-col space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
              isActive(item.href)
                ? isScrolled
                  ? 'text-white border-l-2 border-white'
                  : 'text-gray-900 border-l-2 border-gray-900'
                : isScrolled
                  ? 'text-white/80 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.name}
          </Link>
        ))}
        {!session && (
          <Link
            href="/auth/signin"
            onClick={onClose}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 text-center ${
              isScrolled
                ? 'text-white border border-white/30 hover:border-white/50 bg-transparent hover:bg-white/10'
                : 'text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white bg-transparent'
            }`}
          >
            {t('signIn')}
          </Link>
        )}
      </div>
    </div>
  )
}

