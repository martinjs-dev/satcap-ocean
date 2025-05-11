import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { v2 as cloudinary } from "cloudinary"

import { authOptions } from "@/lib/auth"

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer les statistiques de stockage de Cloudinary
    const result = await cloudinary.api.usage()

    // Calculer le pourcentage d'utilisation
    const usedStorage = result.resources.storage / 1024 / 1024 // en MB
    const totalStorage = 10 * 1024 // 10 GB en MB
    const usagePercentage = Math.min(Math.round((usedStorage / totalStorage) * 100), 100)

    return NextResponse.json({
      usagePercentage,
      usedStorage: Math.round(usedStorage),
      totalStorage: totalStorage,
      resources: result.resources.total,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques de stockage:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques de stockage" }, { status: 500 })
  }
}
