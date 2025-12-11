'use client'

import { useState, useEffect } from 'react'
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 20
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div
      className={`sticky z-50 transition-all duration-300 ${
        isScrolled
          ? 'top-4 w-full px-4'
          : 'top-0 w-full'
      }`}
    >
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'max-w-7xl mx-auto px-6 lg:px-8 bg-[#1B4D3E] backdrop-blur-md rounded-full shadow-lg'
            : 'w-full bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Brand isScrolled={isScrolled} />
          </div>

          <MobileNavbar
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            navigation={navigation}
            isActive={isActive}
            session={session}
            isScrolled={isScrolled}
          />

          <div className="hidden md:flex items-center flex-1 justify-center mx-8">
            <NavLinks
              navigation={navigation}
              isActive={isActive}
              session={session}
              isScrolled={isScrolled}
            />
          </div>

          {/* Right side: User menu */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* User Menu */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                    isScrolled
                      ? 'hover:bg-[#1B4D3E]/80 text-white'
                      : 'hover:bg-white/20'
                  }`}
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isScrolled ? 'bg-white/20' : 'bg-white/30'
                    }`}>
                      <span className={`text-sm font-medium ${
                        isScrolled ? 'text-white' : 'text-gray-900'
                      }`}>
                        {(session.user.name || session.user.username || session.user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className={`hidden md:block text-sm font-medium ${
                    isScrolled ? 'text-white' : 'text-gray-900'
                  }`}>
                    {session.user.username || session.user.name || session.user.email?.split('@')[0]}
                  </span>
                  <svg className={`w-4 h-4 ${
                    isScrolled ? 'text-white' : 'text-gray-900'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg backdrop-blur-md border z-20 ${
                      isScrolled
                        ? 'bg-[#1B4D3E]/95 border-[#1B4D3E]/80'
                        : 'bg-white/95 border-gray-200'
                    }`}>
                      <div className="py-1">
                        {session.user.username && (
                          <Link
                            href={`/users/${session.user.username}`}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isScrolled
                                ? 'text-white hover:text-white hover:bg-[#1B4D3E]/80'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {t('profile')}
                          </Link>
                        )}
                        <Link
                          href="/settings"
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isScrolled
                              ? 'text-white hover:text-white hover:bg-[#1B4D3E]/80'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t('settings')}
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' })
                            setUserMenuOpen(false)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isScrolled
                              ? 'text-white hover:text-white hover:bg-[#1B4D3E]/80'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
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
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
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

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navigation={navigation}
          isActive={isActive}
          session={session}
          isScrolled={isScrolled}
        />
      </nav>
    </div>
  )
}

