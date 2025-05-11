import { db } from "@/lib/db"

export async function getDetectionStats() {
  // Simuler des données pour la démo
  return {
    totalDetections: 128,
    totalObjects: 297,
    averageConfidence: 78,
    mainType: {
      name: "Bouteille plastique",
      percentage: 43,
    },
    monthlyGrowth: {
      detections: 12,
      objects: 18,
      confidence: 4,
    },
    typeDistribution: [
      { name: "Bouteilles", count: 128 },
      { name: "Sacs", count: 76 },
      { name: "Gobelets", count: 45 },
      { name: "Emballages", count: 32 },
      { name: "Autres", count: 16 },
    ],
    confidenceDistribution: [
      { name: "Élevée", value: 180, color: "#10b981" },
      { name: "Moyenne", value: 60, color: "#3b82f6" },
      { name: "Faible", value: 25, color: "#f59e0b" },
    ],
  }
}

export async function getRecentDetections(limit = 3) {
  // Simuler des données pour la démo
  return [
    {
      id: "1235",
      createdAt: new Date("2025-05-10T14:23:00"),
      objectCount: 4,
      confidence: 0.76,
      imageUrl: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "1234",
      createdAt: new Date("2025-05-10T10:15:00"),
      objectCount: 2,
      confidence: 0.82,
      imageUrl: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "1233",
      createdAt: new Date("2025-05-09T16:47:00"),
      objectCount: 6,
      confidence: 0.64,
      imageUrl: "/placeholder.svg?height=64&width=64",
    },
  ]
}

export async function getAllDetections({ page = 1, limit = 5, search = "", type = "", period = "" }) {
  // Simuler des données pour la démo
  const detections = [
    {
      id: "1235",
      createdAt: new Date("2025-05-10T14:23:00"),
      objectCount: 4,
      confidence: 0.87,
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "1234",
      createdAt: new Date("2025-05-10T10:15:00"),
      objectCount: 2,
      confidence: 0.82,
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "1233",
      createdAt: new Date("2025-05-09T16:47:00"),
      objectCount: 6,
      confidence: 0.64,
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "1232",
      createdAt: new Date("2025-05-09T11:32:00"),
      objectCount: 3,
      confidence: 0.92,
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "1231",
      createdAt: new Date("2025-05-08T15:19:00"),
      objectCount: 7,
      confidence: 0.71,
      imageUrl: "/placeholder.svg?height=48&width=48",
    },
  ]

  return {
    detections,
    totalPages: 10,
    totalItems: 48,
  }
}

export async function getDetectionById(id: string) {
  try {
    const detection = await db.detection.findUnique({
      where: { id },
      include: {
        detectedItems: true,
      },
    })

    if (!detection) {
      return null
    }

    return {
      id: detection.id,
      createdAt: detection.createdAt,
      imageUrl: detection.imageUrl,
      resultImageUrl: detection.resultImageUrl || detection.imageUrl,
      rawResult: detection.rawResult,
      detectedItems: detection.detectedItems.map((item) => ({
        id: item.id,
        class: item.class,
        confidence: item.confidence,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      })),
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la détection:", error)
    return null
  }
}

export async function getUserById(id: string) {
  // Simuler des données pour la démo
  return {
    id,
    name: "Admin",
    email: "admin@example.com",
  }
}
