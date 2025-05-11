import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { v2 as cloudinary } from "cloudinary"
import axios from "axios"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { callRoboflowWorkflow } from "@/lib/roboflow"

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

    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "URL d'image requise" }, { status: 400 })
    }

    try {
      // Appel au workflow Roboflow
      const workflowResponse = await callRoboflowWorkflow(imageUrl)

      console.log("Réponse du workflow Roboflow:", workflowResponse.outputs[0].predictions)

      // Vérifier si nous avons une réponse valide
      if (!workflowResponse || workflowResponse.outputs[0].predictions.predictions.length === 0 || !workflowResponse.outputs[0].predictions.predictions) {
        return NextResponse.json(
          {
            id: "no-detection",
            imageUrl,
            resultImageUrl: imageUrl,
            detectedItems: [],
            message: "Aucun déchet plastique détecté dans cette image",
          },
          { status: 200 },
        )
      }

      // Extraire les prédictions et l'image de résultat
      const result = workflowResponse.outputs
      const predictions = result[0].predictions
      const outputImageBase64 = result[0].output_image.value

      // Vérifier si des objets ont été détectés
      if (!predictions || predictions["predictions"].length === 0) {
        return NextResponse.json(
          {
            id: "no-detection",
            imageUrl,
            resultImageUrl: imageUrl,
            detectedItems: [],
            message: "Aucun déchet plastique détecté dans cette image",
          },
          { status: 200 },
        )
      }

      // Télécharger l'image de résultat vers Cloudinary
      const resultImageUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "plastic_detect/results",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )

        // Convertir l'image base64 en buffer
        const buffer = Buffer.from(outputImageBase64, "base64")
        uploadStream.end(buffer)
      })

      // Calculer la confiance moyenne
      const averageConfidence = predictions["predictions"].reduce((sum, pred) => sum + pred.confidence, 0) / predictions["predictions"].length

      // Recuperer l'id de l'utilisateur à partir de la session
      const user = await db.user.findUnique({
        where: { email: session?.user?.email || undefined },
      })

      if (!user) {
        return NextResponse.json({ error: "Utilisateur non trouvé dans la base de données" }, { status: 404 })
      }

      // Enregistrer les résultats dans la base de données
      const detection = await db.detection.create({
        data: {
          imageUrl,
          resultImageUrl: (resultImageUpload as any).secure_url,
          rawResult: JSON.stringify(result),
          userId: user.id,
          detectedItems: {
            create: predictions["predictions"].map((item) => ({
              class: item.class,
              confidence: item.confidence,
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
            })),
          },
        },
        include: {
          detectedItems: true,
        },
      })

      return NextResponse.json({
        id: detection.id,
        imageUrl: detection.imageUrl,
        resultImageUrl: detection.resultImageUrl,
        detectedItems: detection.detectedItems,
        objectCount: detection.detectedItems.length,
        confidence: Math.round(averageConfidence * 100) / 100,
      })
    } catch (error) {
      // Gérer spécifiquement les erreurs 404 du workflow
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return NextResponse.json(
          {
            error:
              "Le workflow Roboflow spécifié n'existe pas ou n'est pas accessible. Veuillez vérifier l'URL du workflow.",
          },
          { status: 404 },
        )
      }

      throw error
    }
  } catch (error) {
    console.error("Erreur lors de la détection:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la détection" },
      { status: 500 },
    )
  }
}
