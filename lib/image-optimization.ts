export async function optimizeImage(file: File, options?: {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}): Promise<File> {
  const maxWidth = options?.maxWidth ?? 1920
  const maxHeight = options?.maxHeight ?? 1920
  const quality = options?.quality ?? 0.8

  return new Promise<File>((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = async () => {
      try {
        const width = img.width
        const height = img.height
        let targetWidth = width
        let targetHeight = height

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspect = width / height
          if (width > height) {
            targetWidth = Math.min(width, maxWidth)
            targetHeight = Math.round(targetWidth / aspect)
          } else {
            targetHeight = Math.min(height, maxHeight)
            targetWidth = Math.round(targetHeight * aspect)
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = targetWidth
        canvas.height = targetHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Unable to get canvas context')

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

        // Convert to blob (use jpeg for lossy compression when possible)
        canvas.toBlob(async (blob) => {
          if (!blob) return reject(new Error('Compression failed'))

          // If size is acceptable, return
          const maxBytes = (options?.maxSizeMB ?? 2) * 1024 * 1024
          if (blob.size <= maxBytes) {
            const optimizedFile = new File([blob], file.name, { type: blob.type })
            URL.revokeObjectURL(url)
            return resolve(optimizedFile)
          }

          // If still too large, try reducing quality iteratively
          let q = quality
          let resultBlob = blob
          for (let i = 0; i < 3 && resultBlob.size > maxBytes; i++) {
            q = Math.max(0.4, q - 0.2)
            // try again using toDataURL then convert
            const dataUrl = canvas.toDataURL('image/jpeg', q)
            const resBlob = await (await fetch(dataUrl)).blob()
            resultBlob = resBlob
          }

          const finalFile = new File([resultBlob], file.name, { type: resultBlob.type })
          URL.revokeObjectURL(url)
          resolve(finalFile)
        }, 'image/jpeg', quality)
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for optimization'))
    }

    img.src = url
  })
}
