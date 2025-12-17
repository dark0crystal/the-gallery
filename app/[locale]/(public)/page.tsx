import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('common')

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-gray-900">
          {t('home')}
        </h1>
        <p className="max-w-md text-lg leading-8 text-gray-700">
          Nature Photography Platform
        </p>
      </main>
    </div>
  )
}

