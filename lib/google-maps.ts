import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!

let loader: Loader | null = null

export function getGoogleMapsLoader(): Loader {
  if (!loader) {
    loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geocoding'],
    })
  }
  return loader
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
  )
  const data = await response.json()
  return data.result
}

export async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
  )
  const data = await response.json()
  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location
    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: data.results[0].formatted_address,
      placeId: data.results[0].place_id,
    }
  }
  return null
}

export async function reverseGeocode(lat: number, lng: number) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
  )
  const data = await response.json()
  if (data.results && data.results.length > 0) {
    return {
      formattedAddress: data.results[0].formatted_address,
      placeId: data.results[0].place_id,
      addressComponents: data.results[0].address_components,
    }
  }
  return null
}

