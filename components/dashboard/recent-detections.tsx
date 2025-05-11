import Link from "next/link"
import { Eye, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface Detection {
  id: string
  createdAt: Date
  objectCount: number
  confidence: number
  imageUrl: string
}

interface RecentDetectionsProps {
  detections: Detection[]
}

export function RecentDetections({ detections }: RecentDetectionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium text-gray-800">Détections récentes</div>
        <Link href="/history">
          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
            Voir toutes
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {detections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucune détection récente</div>
        ) : (
          detections.map((detection) => (
            <div key={detection.id} className="flex items-center border-b border-gray-100 pb-4">
              <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 overflow-hidden">
                {detection.imageUrl ? (
                  <img
                    src={detection.imageUrl || "/placeholder.svg"}
                    alt={`Détection ${detection.id}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">DT-{detection.id.substring(0, 4)}</div>
                    <div className="text-xs text-gray-500">{formatDate(detection.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{detection.objectCount} objets</div>
                    <div className="text-xs text-gray-500">{detection.confidence}% confiance</div>
                  </div>
                </div>
              </div>
              <Link href={`/results/${detection.id}`}>
                <Button variant="ghost" size="icon" className="ml-4 h-8 w-8 text-gray-400 hover:text-gray-600">
                  <Eye size={16} />
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
