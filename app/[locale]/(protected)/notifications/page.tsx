import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'

export default async function NotificationsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <p className="text-gray-500">Notifications feature will be implemented here</p>
    </div>
  )
}

