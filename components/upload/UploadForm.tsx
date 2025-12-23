'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function UploadForm() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [dimensions, setDimensions] = useState<{ width: number, height: number } | null>(null)
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('') // Just text for now, but backend expects ID?

    // Post API expects locationId. I need to create or find location.
    // For prototype, I will just pick a hardcoded ID or creating one might be complex.
    // Maybe I'll search for locations first?
    // Or I can add a mode to creating location on the fly, but usage says "locationId".
    // I'll assume there is a default location or generic one?
    // Actually, I'll fetch locations first or search.
    // For simplicity, I'll use a mocked Location ID or try to find one.
    // I'll skip complex location search and just require one if possible.

    // Wait, I can't easily get a valid UUID for location without fetching.
    // I'll implement a simple fetch or just use a known one if I had seeded.
    // Since seeding failed, I might have 0 locations.
    // This is a bottleneck. I need to ensure a location exists.

    // I'll check `app/api/locations/route.ts` if it simplifies things (create if not exists).

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0]
            setFile(f)
            const url = URL.createObjectURL(f)
            setPreview(url)

            const img = new Image()
            img.onload = () => {
                setDimensions({ width: img.width, height: img.height })
            }
            img.src = url
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !dimensions) return
        if (!location) {
            alert('Please enter a location name (we will find/create it)')
            // actually just mocking the ID logic for now
        }

        setLoading(true)

        try {
            // 1. Upload
            const formData = new FormData()
            formData.append('files', file)

            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!uploadRes.ok) throw new Error('Upload failed')

            const { imageUrls } = await uploadRes.json()
            const imageUrl = imageUrls[0]

            // 2. Resolve Location (Hack for prototype: Create random one or pick first)
            // I'll assume valid 'locationId' is needed. 
            // I'll make a quick call to /api/locations?search=... if exists.
            // Or just try to create a location?

            // Realistically, I should POST /api/locations. 
            // I'll assume I can send 'locationName' to POST /api/posts if I update it? 
            // No, it strictly expects 'locationId'.

            // I will hardcode a helper function to create location or just use a placeholder UUID.
            // But FK constraint will fail.

            // Strategy: Create a location first.
            // POST /api/locations with { name: location }
            // I need to check if that endpoint exists.

            // Short-circuit: I'll try to fetch existing locations.
        } catch (err) {
            console.error(err)
            alert('Failed to create pin')
        } finally {
            setLoading(false)
        }
    }

    // To save time, I will just build the UI first.
    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-sm min-h-[600px]">
            {/* Left: Image Upload */}
            <div className="flex-1 bg-gray-100 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => { setFile(null); setPreview(null) }}
                            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-50"
                        >
                            ✕
                        </button>
                    </>
                ) : (
                    <label className="cursor-pointer text-center p-8 w-full h-full flex flex-col items-center justify-center">
                        <div className="text-4xl mb-4">↑</div>
                        <p className="text-gray-600 font-medium">Choose a file or drag and drop it here</p>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                )}
            </div>

            {/* Right: Form Fields */}
            <div className="flex-1 flex flex-col gap-6 py-4">
                <input
                    type="text"
                    placeholder="Add your title"
                    className="text-4xl font-bold border-b placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pb-2"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">User Name</span>
                </div>

                <textarea
                    placeholder="Tell everyone what your Pin is about"
                    className="text-lg border-b resize-none placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pb-2 h-24"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Add a destination link (optional)"
                    className="text-base border-b placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pb-2"
                />

                <div className="mt-auto flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className="bg-[#E60023] text-white font-bold px-6 py-3 rounded-full hover:bg-[#ad081b] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    )
}
