import { useTranslations } from 'next-intl'

export default function SearchPage() {
  const t = useTranslations('common')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('search')}</h1>
      <div className="max-w-2xl">
        <input
          type="text"
          placeholder="Search users, posts, locations..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  )
}

