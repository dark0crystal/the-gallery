export interface Image {
    id: string
    imageUrl: string
    width: number | null
    height: number | null
    order: number
}

export interface User {
    id: string
    username: string | null
    name: string | null
    image: string | null
}

export interface Post {
    id: string
    title: string | null
    description: string | null
    userId: string
    user: User
    images: Image[]
    createdAt: Date
    isLiked?: boolean
    isSaved?: boolean
    _count?: {
        likes: number
        comments: number
        saves: number
    }
}
