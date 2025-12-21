import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadImage } from '@/lib/digitalocean'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const fileName = file.name
      const contentType = file.type

      const imageUrl = await uploadImage(buffer, fileName, contentType)
      return imageUrl
    })

    const imageUrls = await Promise.all(uploadPromises)

    return NextResponse.json({ imageUrls })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
  }
}

