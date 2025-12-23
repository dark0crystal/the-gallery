import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { SignInButton } from './signin-button'
import { getTranslations } from 'next-intl/server'
import { ErrorMessage } from './error-message'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  const t = await getTranslations('auth')
  const params = await searchParams
  const error = params?.error
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-10 pb-8 text-center border-b border-gray-200 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="currentColor"
                  className="text-emerald-600"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('welcome')}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('welcomeDescription')}
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {t('signInToContinue')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {t('signInDescription')}
                </p>
              </div>

              {error && <ErrorMessage error={error} />}

        <SignInButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    {t('secureSignIn')}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('privacyNotice')}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {t('termsNotice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

