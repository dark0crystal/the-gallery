'use client'

interface Category {
  id: string
  name: string
  icon?: string | null
  color?: string | null
}

interface CategoryBadgeProps {
  category: Category
  className?: string
  onClick?: () => void
}

export function CategoryBadge({ category, className = '', onClick }: CategoryBadgeProps) {
  const badgeStyle = category.color
    ? { backgroundColor: `${category.color}20`, color: category.color, borderColor: category.color }
    : { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${className}`}
      style={badgeStyle}
    >
      {category.icon && <span>{category.icon}</span>}
      <span>{category.name}</span>
    </span>
  )
}


