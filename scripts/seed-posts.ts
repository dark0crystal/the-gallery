
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding data...')

    // 1. Create or get a user
    const email = 'demo@example.com'
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                username: 'demo_user',
                name: 'Demo User',
                image: 'https://i.pravatar.cc/150?u=demo',
            },
        })
        console.log('Created user:', user.username)
    }

    // 2. Create a location
    const locationName = 'Yosemite National Park'
    let location = await prisma.location.findFirst({ where: { name: locationName } })
    if (!location) {
        location = await prisma.location.create({
            data: {
                name: locationName,
                latitude: 37.8651,
                longitude: -119.5383,
                country: 'USA',
            },
        })
        console.log('Created location:', location.name)
    }

    // 3. Create Posts
    const images = [
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', w: 800, h: 1200 },
        { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', w: 1200, h: 800 },
        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', w: 1000, h: 1000 },
        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', w: 800, h: 600 },
        { url: 'https://images.unsplash.com/photo-1426604966848-d3ad1f6b2409', w: 800, h: 1200 },
        { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d', w: 900, h: 1300 },
        { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', w: 1000, h: 600 },
        { url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07', w: 800, h: 1000 },
        { url: 'https://images.unsplash.com/photo-1511497584788-876760111969', w: 1200, h: 900 },
        { url: 'https://images.unsplash.com/photo-1504567961542-e24d9439a724', w: 800, h: 1200 },
    ]

    for (let i = 0; i < 20; i++) {
        const imgInfo = images[i % images.length]
        await prisma.post.create({
            data: {
                title: `Nature Shot ${i + 1}`,
                description: 'A beautiful scene from nature.',
                userId: user.id,
                locationId: location.id,
                images: {
                    create: {
                        imageUrl: `${imgInfo.url}?auto=format&fit=crop&w=800&q=80`,
                        width: imgInfo.w,
                        height: imgInfo.h,
                        order: 0,
                    },
                },
            },
        })
    }

    console.log('Seeded 20 posts.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
