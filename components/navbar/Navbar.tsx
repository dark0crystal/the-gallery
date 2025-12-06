'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { Brand } from './Brand'
import { NavLinks } from './NavLinks'
import { MobileNavbar, MobileMenu } from './MobileNavbar'

interface NavbarProps {
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

export function Navbar({ session }: NavbarProps) {
  const t = useTranslations('common')
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('explore'), href: '/explore' },
    { name: t('search'), href: '/search' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#f9f5ec]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Brand />

          <MobileNavbar
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            navigation={navigation}
            isActive={isActive}
            session={session}
          />

          <NavLinks
            navigation={navigation}
            isActive={isActive}
            session={session}
          />

          {/* Right side: User menu */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || session.user.username || 'User'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {(session.user.name || session.user.username || session.user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {session.user.username || session.user.name || session.user.email?.split('@')[0]}
                  </span>
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1">
                        {session.user.username && (
                          <Link
                            href={`/users/${session.user.username}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {t('profile')}
                          </Link>
                        )}
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t('settings')}
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' })
                            setUserMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('signOut')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navigation={navigation}
          isActive={isActive}
          session={session}
        />
      </div>
    </nav>
  )
}

