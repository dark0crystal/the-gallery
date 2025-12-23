'use client'

import { useState, useEffect, useRef } from 'react'

interface Location {
  id: string
  name: string
  address?: string | null
  country?: string | null
}

interface LocationSearchProps {
  value: string
  onChange: (locationId: string) => void
  placeholder?: string
  className?: string
}

export function LocationSearch({ value, onChange, placeholder = 'Search for a location...', className = '' }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch selected location details if value exists
    if (value && !selectedLocation) {
      fetchLocationDetails(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchLocationDetails = async (locationId: string) => {
    try {
      // Try to fetch by ID first (if API supports it)
      const response = await fetch(`/api/locations?q=${encodeURIComponent(locationId)}`)
      if (response.ok) {
        const data = await response.json()
        const location = Array.isArray(data) 
          ? data.find((loc: Location) => loc.id === locationId)
          : data
        if (location) {
          setSelectedLocation(location)
          setSearchTerm(location.name)
        }
      }
    } catch (error) {
      console.error('Error fetching location details:', error)
    }
  }

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocations([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/locations?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setLocations(data)
        setIsOpen(data.length > 0)
      }
    } catch (error) {
      console.error('Error searching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchTerm(query)
    setSelectedLocation(null)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query)
    }, 300)
  }

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location)
    setSearchTerm(location.name)
    onChange(location.id)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSearchTerm('')
    setSelectedLocation(null)
    onChange('')
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm && locations.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          aria-label="Location search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {selectedLocation && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear location"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && locations.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <ul role="listbox" className="py-2">
            {locations.map((location) => (
              <li
                key={location.id}
                role="option"
                onClick={() => handleSelectLocation(location)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="font-medium text-gray-900">{location.name}</div>
                {location.address && (
                  <div className="text-sm text-gray-500 mt-1">{location.address}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

