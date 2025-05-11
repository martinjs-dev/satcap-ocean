"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { changePassword } from "@/lib/actions"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

export function SecuritySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true)
    try {
      await changePassword(data.currentPassword, data.newPassword)
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès",
      })
      reset()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le mot de passe. Vérifiez votre mot de passe actuel.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Sécurité</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe actuel
          </Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            className="h-10 w-full px-3 py-2 bg-white border border-gray-300"
            disabled={isLoading}
            {...register("currentPassword")}
          />
          {errors?.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Nouveau mot de passe
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            className="h-10 w-full px-3 py-2 bg-white border border-gray-300"
            disabled={isLoading}
            {...register("newPassword")}
          />
          {errors?.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le nouveau mot de passe
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-10 w-full px-3 py-2 bg-white border border-gray-300"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {errors?.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="h-10 px-4 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Modification..." : "Modifier le mot de passe"}
          </Button>
        </div>
      </form>
    </div>
  )
}
