'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryForm } from './category-form'

interface Category {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  _count?: {
    posts: number
  }
}

interface CategoriesListProps {
  initialCategories: Category[]
}

export function CategoriesList({ initialCategories }: CategoriesListProps) {
  const t = useTranslations('category')
  const tCommon = useTranslations('common')
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete category')
        return
      }

      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = async () => {
    // Refresh categories list
    const response = await fetch('/api/categories')
    if (response.ok) {
      const data = await response.json()
      setCategories(data)
    }
    setEditingCategory(null)
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowCreateForm(true)
            setEditingCategory(null)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('createCategory')}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('createCategory')}</h2>
          <CategoryForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {editingCategory && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('editCategory')}</h2>
          <CategoryForm
            category={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingCategory(null)}
          />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('categoryDescription')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No categories yet. Create one to get started.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {category.color && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {category.icon && <span>{category.icon}</span>}
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {category.description || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {category._count?.posts || 0} posts
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          setShowCreateForm(false)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {tCommon('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deletingId === category.id ? tCommon('loading') : tCommon('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


