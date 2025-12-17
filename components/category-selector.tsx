'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
}

interface CategorySelectorProps {
  selectedCategoryIds: string[]
  onChange: (categoryIds: string[]) => void
  className?: string
}

export function CategorySelector({ selectedCategoryIds, onChange, className = '' }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onChange(selectedCategoryIds.filter((id) => id !== categoryId))
    } else {
      onChange([...selectedCategoryIds, categoryId])
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className={className}>
        <p className="text-gray-500">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-2">
        {filteredCategories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No categories found</p>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category.id)
              return (
                <label
                  key={category.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {category.color && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {category.icon && (
                        <span className="text-lg">{category.icon}</span>
                      )}
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>
      {selectedCategoryIds.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {selectedCategoryIds.length} categor{selectedCategoryIds.length === 1 ? 'y' : 'ies'} selected
        </p>
      )}
    </div>
  )
}


