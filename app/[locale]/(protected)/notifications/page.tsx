import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NotificationList from '@/components/notifications/NotificationList'

export default async function NotificationsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      relatedUser: { select: { id: true, name: true, username: true, image: true } },
      relatedPost: { select: { id: true, title: true } },
    },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {/* @ts-expect-error Server -> Client */}
      <NotificationList initial={JSON.parse(JSON.stringify(notifications))} />
    </div>
  )
}

