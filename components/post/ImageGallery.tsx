'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images }: { images: { id: string; imageUrl: string; altText?: string }[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const openAt = (i: number) => {
    setIndex(i)
    setZoom(1)
    setOpen(true)
  }

  const close = () => setOpen(false)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  const onKey = useCallback((e: KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'Escape') close()
  }, [open, next, prev])
  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  // basic touch swipe
  useEffect(() => {
    let startX = 0
    let endX = 0
    const handleTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX)
    const handleTouchMove = (e: TouchEvent) => (endX = e.touches[0].clientX)
    const handleTouchEnd = () => {
      const diff = startX - endX
      if (Math.abs(diff) > 50) {
        if (diff > 0) next()
        else prev()
      }
    }

    const el = containerRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart)
    el.addEventListener('touchmove', handleTouchMove)
    el.addEventListener('touchend', handleTouchEnd)
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [next, prev])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {images.map((img, i) => (
          <button key={img.id} onClick={() => openAt(i)} className="focus:outline-none">
            <div className="relative w-full h-64 sm:h-52 lg:h-72 rounded-lg overflow-hidden bg-gray-100">
              <Image src={img.imageUrl} alt={img.altText || 'Post image'} fill className="object-cover" unoptimized />
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <button onClick={close} className="absolute top-6 right-6 text-white p-2 rounded-lg bg-black/30">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-[90%] max-h-[90%] w-full relative flex items-center justify-center">
            <button onClick={prev} aria-label="Previous" className="absolute left-2 text-white p-3 rounded-full bg-black/20">
              ‹
            </button>

            <div className="relative w-full h-[70vh] flex items-center justify-center">
              <Image
                src={images[index].imageUrl}
                alt={images[index].altText || ''}
                fill
                className="object-contain"
                style={{ transform: `scale(${zoom})` }}
                unoptimized
              />
            </div>

            <button onClick={next} aria-label="Next" className="absolute right-2 text-white p-3 rounded-full bg-black/20">
              ›
            </button>

            <div className="absolute bottom-6 text-white text-sm">
              {index + 1}/{images.length}
            </div>

            <div className="absolute bottom-6 right-6 flex gap-2">
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.5))} className="bg-white/10 text-white p-2 rounded">+</button>
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="bg-white/10 text-white p-2 rounded">-</button>
              <button onClick={() => setZoom(1)} className="bg-white/10 text-white p-2 rounded">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
