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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { publicId } = await req.json()

    if (!publicId) {
      return NextResponse.json({ error: "ID public requis" }, { status: 400 })
    }

    // Supprimer l'image de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result !== "ok") {
      return NextResponse.json({ error: "Échec de la suppression de l'image" }, { status: 500 })
    }

    // Dans une implémentation réelle, nous mettrions également à jour la base de données
    // pour supprimer les références à cette image

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'image" }, { status: 500 })
  }
}
