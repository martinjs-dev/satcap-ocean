"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/lib/actions"

interface User {
  id: string
  name: string | null
  email: string
}

interface ProfileSettingsProps {
  user: User | null
}

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return

    setIsLoading(true)
    try {
      await updateUserProfile(user.id, data)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Profil utilisateur</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row mb-8">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || "AD"}
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </Label>
                <Input
                  id="name"
                  type="text"
                  className="h-10 w-full px-3 py-2 bg-white border border-gray-300"
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors?.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-10 w-full px-3 py-2 bg-white border border-gray-300"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors?.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone (optionnel)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              className="h-10 w-full px-3 py-2 bg-white border border-gray-300"
              disabled={isLoading}
              {...register("phone")}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="h-10 px-4 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
