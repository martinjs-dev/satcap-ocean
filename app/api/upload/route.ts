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

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 })
    }

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Créer un stream à partir du buffer
    const stream = require("stream")
    const readableStream = new stream.PassThrough()
    readableStream.end(buffer)

    // Télécharger vers Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "plastic_detect",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Erreur Cloudinary:", error)
            reject(NextResponse.json({ error: "Erreur lors du téléchargement" }, { status: 500 }))
          } else {
            resolve(
              NextResponse.json({
                url: result?.secure_url,
                publicId: result?.public_id,
                width: result?.width,
                height: result?.height,
              }),
            )
          }
        },
      )

      readableStream.pipe(uploadStream)
    })
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error)
    return NextResponse.json({ error: "Erreur lors du téléchargement" }, { status: 500 })
  }
}
