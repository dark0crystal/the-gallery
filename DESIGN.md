# Pinterest-Style Gallery Design Document

## 1. High-Level System Architecture

The system is built as a monolithic Full-Stack application using Next.js (App Router).

- **Frontend**: React (Server & Client Components), Tailwind CSS for styling.
- **Backend / API**: Next.js Route Handlers (`/app/api/...`) and Server Actions for mutations.
- **Database**: PostgreSQL managed via Prisma ORM.
- **Storage**: Object Storage (S3 compatible) for image files.
- **Caching**: Redis (optional/planned) or Next.js built-in Data Cache.

**Data Flow**:
1. User uploads image -> Signed URL/Upload API -> S3 -> DB Record created.
2. Feed -> Fetch `Posts` (Pins) with cursor-based pagination -> Render Masonry Grid.
3. Interaction (Like/Save) -> Optimistic UI Update -> Server Action -> DB Update.

## 2. Database Schema (Prisma)

We adapt the existing schema to support "Pinterest" features (Saves, Image Dimensions).

```prisma
// Existing User model ...
model User {
  // ... existing fields
  saves     Save[]
}

// Post acts as the "Pin"
model Post {
  id          String   @id @default(uuid())
  // ... existing fields
  saves       Save[]
  // images relation exists
}

model Image {
  id          String   @id @default(uuid())
  postId      String
  imageUrl    String
  width       Int?     // Added for Masonry layout calculations
  height      Int?     // Added for Masonry layout calculations
  // ... existing fields
}

model Save {
  id        String   @id @default(uuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
  @@map("saves")
}
```

## 3. API Design

### Endpoints (Route Handlers)

- **GET /api/posts?cursor={id}&limit=20**
  - Returns a list of posts with image data, author info, and simplified metrics (like count).
  - Used for the Infinite Scroll Home Feed.

- **POST /api/posts**
  - Uploads/Create a new Pin. Accepts `title`, `description`, `image` (file).

- **GET /api/posts/[id]**
  - Detailed view of a pin.

- **POST /api/posts/[id]/like**
  - Toggle like status.

- **POST /api/posts/[id]/save**
  - Toggle save status.

### Example Response (GET /api/posts)

```json
{
  "data": [
    {
      "id": "123",
      "title": "Mountain View",
      "user": { "username": "alex", "image": "..." },
      "image": {
        "url": "https://...",
        "width": 800,
        "height": 1200
      },
      "liked": false,
      "saved": false
    }
  ],
  "nextCursor": "124"
}
```

## 4. Frontend Component Structure

- **`MasonryGrid`**: Main layout container. Handles column distribution based on screen width.
- **`PinCard`**: Individual item in the grid.
  - Displays Image.
  - Hover overlay: Save button (top right), Link/Share (bottom right), User info.
- **`Feed`**: Wrapper for `MasonryGrid` handling data fetching and infinite scroll (using `IntersectionObserver`).
- **`ImageModal`**: Intercepting route or detailed view for clicking a pin.
