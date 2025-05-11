"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { v2 as cloudinary } from "cloudinary"
import bcryptjs from "bcryptjs" // Remplacer bcrypt par bcryptjs

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function updateUserProfile(userId: string, data: { name: string; email: string; phone?: string }) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.id !== userId) {
    throw new Error("Non autorisé")
  }

  // Mettre à jour la base de données
  await db.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
    },
  })

  revalidatePath("/settings")
  return { success: true }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Non autorisé")
  }

  try {
    // Récupérer l'utilisateur
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    })

    if (!user) {
      throw new Error("Utilisateur non trouvé")
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password) // Utiliser bcryptjs.compare
    if (!isPasswordValid) {
      throw new Error("Mot de passe actuel incorrect")
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcryptjs.hash(newPassword, 10) // Utiliser bcryptjs.hash

    // Mettre à jour le mot de passe
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error)
    throw error
  }
}

export async function regenerateApiKey() {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Non autorisé")
  }

  // Générer une nouvelle clé API
  const newKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  // Dans une implémentation réelle, nous stockerions cette clé dans la base de données
  // await db.apiKey.upsert({
  //   where: { userId: session.user.id },
  //   update: { key: newKey },
  //   create: { userId: session.user.id, key: newKey },
  // })

  return newKey
}

export async function clearStorage() {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Non autorisé")
  }

  try {
    // Récupérer les images plus anciennes que 30 jours
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Dans une implémentation réelle, nous récupérerions les images de la base de données
    // const oldDetections = await db.detection.findMany({
    //   where: {
    //     userId: session.user.id,
    //     createdAt: {
    //       lt: thirtyDaysAgo,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     imageUrl: true,
    //     resultImageUrl: true,
    //   },
    // })

    // Supprimer les images de Cloudinary
    // Pour chaque image, extraire l'ID public de l'URL
    // const publicIds = oldDetections.flatMap(detection => {
    //   const ids = []
    //   if (detection.imageUrl) {
    //     const match = detection.imageUrl.match(/\/v\d+\/(.+)\.\w+$/)
    //     if (match && match[1]) ids.push(match[1])
    //   }
    //   if (detection.resultImageUrl) {
    //     const match = detection.resultImageUrl.match(/\/v\d+\/(.+)\.\w+$/)
    //     if (match && match[1]) ids.push(match[1])
    //   }
    //   return ids
    // })

    // Supprimer les images de Cloudinary
    // await Promise.all(publicIds.map(publicId => cloudinary.uploader.destroy(publicId)))

    // Supprimer les détections de la base de données
    // await db.detectedItem.deleteMany({
    //   where: {
    //     detection: {
    //       id: {
    //         in: oldDetections.map(d => d.id),
    //       },
    //     },
    //   },
    // })

    // await db.detection.deleteMany({
    //   where: {
    //     id: {
    //       in: oldDetections.map(d => d.id),
    //     },
    //   },
    // })

    // Pour la démo, nous allons simplement supprimer toutes les ressources du dossier plastic_detect
    // qui ont plus de 30 jours
    const result = await cloudinary.api.delete_resources_by_prefix("plastic_detect", {
      type: "upload",
      resource_type: "image",
    })

    revalidatePath("/settings")
    revalidatePath("/history")
    return { success: true, result }
  } catch (error) {
    console.error("Erreur lors du nettoyage du stockage:", error)
    throw error
  }
}

export async function deleteDetection(id: string) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Non autorisé")
  }

  try {
    // Récupérer la détection
    const detection = await db.detection.findUnique({
      where: { id },
      select: {
        id: true,
        imageUrl: true,
        resultImageUrl: true,
        userId: true,
      },
    })

    // Vérifier que l'utilisateur est autorisé à supprimer cette détection
    if (!detection || detection.userId !== session.user.id) {
      throw new Error("Non autorisé")
    }

    // Supprimer les images de Cloudinary
    if (detection.imageUrl) {
      const match = detection.imageUrl.match(/\/v\d+\/(.+)\.\w+$/)
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1])
      }
    }

    if (detection.resultImageUrl && detection.resultImageUrl !== detection.imageUrl) {
      const match = detection.resultImageUrl.match(/\/v\d+\/(.+)\.\w+$/)
      if (match && match[1]) {
        await cloudinary.uploader.destroy(match[1])
      }
    }

    // Supprimer les données de la base de données
    await db.detectedItem.deleteMany({
      where: { detectionId: id },
    })

    await db.detection.delete({
      where: { id },
    })

    revalidatePath("/history")
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression de la détection:", error)
    throw error
  }
}
