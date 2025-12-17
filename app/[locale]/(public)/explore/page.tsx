import { useTranslations } from 'next-intl'

export default function ExplorePage() {
  const t = useTranslations('common')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('explore')}</h1>
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map will be integrated here</p>
      </div>
    </div>
  )
}

