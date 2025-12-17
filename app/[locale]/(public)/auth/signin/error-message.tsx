'use client'

import { useTranslations } from 'next-intl'

interface ErrorMessageProps {
  error: string
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  const t = useTranslations('auth')

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'OAuthAccountNotLinked':
        return t('errorAccountNotLinked')
      case 'OAuthSignin':
        return t('errorOAuthSignin')
      case 'OAuthCallback':
        return t('errorOAuthCallback')
      case 'OAuthCreateAccount':
        return t('errorOAuthCreateAccount')
      case 'EmailCreateAccount':
        return t('errorEmailCreateAccount')
      case 'Callback':
        return t('errorCallback')
      case 'OAuthAccountNotLinked':
        return t('errorAccountNotLinked')
      case 'EmailSignin':
        return t('errorEmailSignin')
      case 'CredentialsSignin':
        return t('errorCredentialsSignin')
      case 'SessionRequired':
        return t('errorSessionRequired')
      case 'Configuration':
        return t('errorConfiguration')
      default:
        return t('errorGeneric')
    }
  }

  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {t('errorTitle')}
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{getErrorMessage(error)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

