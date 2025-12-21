import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const spacesEndpoint = process.env.DO_SPACES_ENDPOINT!
const spacesRegion = process.env.DO_SPACES_REGION || 'nyc3'
const spacesAccessKeyId = process.env.DO_SPACES_ACCESS_KEY_ID!
const spacesSecretAccessKey = process.env.DO_SPACES_SECRET_ACCESS_KEY!
const spacesBucket = process.env.DO_SPACES_BUCKET!

const s3Client = new S3Client({
  endpoint: `https://${spacesEndpoint}`,
  region: spacesRegion,
  credentials: {
    accessKeyId: spacesAccessKeyId,
    secretAccessKey: spacesSecretAccessKey,
  },
})

export async function uploadImage(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `images/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: spacesBucket,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  })
  
  await s3Client.send(command)
  
  return `https://${spacesBucket}.${spacesEndpoint}/${key}`
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl)
    const key = url.pathname.substring(1) // Remove leading slash
    
    const command = new DeleteObjectCommand({
      Bucket: spacesBucket,
      Key: key,
    })
    
    await s3Client.send(command)
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

export { s3Client }

