import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCache, setCache, CACHE_TTL } from '@/lib/cache'
import { geocodeAddress, reverseGeocode } from '@/lib/google-maps'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (query) {
      // Search by query
      const locations = await prisma.location.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      })
      return NextResponse.json(locations)
    }

    if (lat && lng) {
      // Search nearby locations
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)

      // Simple radius search (can be improved with PostGIS)
      const locations = await prisma.location.findMany({
        take: 50,
      })

      // Filter by distance (simple calculation)
      const nearbyLocations = locations
        .map((loc) => {
          const distance = Math.sqrt(
            Math.pow(parseFloat(loc.latitude.toString()) - latitude, 2) +
            Math.pow(parseFloat(loc.longitude.toString()) - longitude, 2)
          )
          return { ...loc, distance }
        })
        .filter((loc) => loc.distance < 0.1) // ~11km radius
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20)

      return NextResponse.json(nearbyLocations)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, latitude, longitude, googlePlaceId, address, country, region } = body

    // Check if location already exists
    let location = await prisma.location.findFirst({
      where: {
        OR: [
          { googlePlaceId: googlePlaceId || '' },
          {
            latitude: { equals: latitude },
            longitude: { equals: longitude },
          },
        ],
      },
    })

    if (!location) {
      // If no Google Place ID, try to get it from coordinates
      if (!googlePlaceId && latitude && longitude) {
        const geocodeResult = await reverseGeocode(latitude, longitude)
        if (geocodeResult) {
          location = await prisma.location.findFirst({
            where: { googlePlaceId: geocodeResult.placeId },
          })
        }
      }

      if (!location) {
        location = await prisma.location.create({
          data: {
            name: name || 'Unknown Location',
            latitude,
            longitude,
            googlePlaceId: googlePlaceId || undefined,
            address,
            country,
            region,
          },
        })
      }
    }

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}

