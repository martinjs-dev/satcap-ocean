import type { Metadata } from "next"
import { getServerSession } from "next-auth"

import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { ApiSettings } from "@/components/settings/api-settings"
import { StorageSettings } from "@/components/settings/storage-settings"
import { authOptions } from "@/lib/auth"
import { getUserById } from "@/lib/data"

export const metadata: Metadata = {
  title: "Paramètres - PlasticDetect",
  description: "Gérez vos paramètres et préférences",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.id ? await getUserById(session.user.id) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProfileSettings user={user} />
        <SecuritySettings />
      </div>

      <div className="lg:col-span-1">
        <ApiSettings />
        <StorageSettings />
      </div>
    </div>
  )
}
