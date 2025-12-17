import { redirect } from '@/i18n/navigation'
import { requireModerator } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { CategoriesList } from './categories-list'

export default async function AdminCategoriesPage() {
  try {
    await requireModerator()
  } catch {
    redirect('/')
  }

  const t = await getTranslations('category')
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('manageCategories')}</h1>
      </div>
      <CategoriesList initialCategories={categories} />
    </div>
  )
}


