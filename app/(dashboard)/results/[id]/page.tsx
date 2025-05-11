import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ResultImages } from "@/components/results/result-images"
import { ResultTable } from "@/components/results/result-table"
import { ResultRawData } from "@/components/results/result-raw-data"
import { getDetectionById } from "@/lib/data"
import { formatDate } from "@/lib/utils"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const detection = await getDetectionById(params.id)

  if (!detection) {
    return {
      title: "Résultat non trouvé - PlasticDetect",
    }
  }

  return {
    title: `Résultat DT-${detection.id.substring(0, 4)} - PlasticDetect`,
    description: `Résultat de la détection de déchets plastiques du ${formatDate(detection.createdAt)}`,
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const detection = await getDetectionById(params.id)

  if (!detection) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/history">
            <Button
              variant="outline"
              size="icon"
              className="mr-4 bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200"
            >
              <ChevronLeft size={18} />
            </Button>
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          ID: DT-{detection.id.substring(0, 4)} • {formatDate(detection.createdAt)}
        </div>
      </div>

      <ResultImages
        originalImage={detection.imageUrl}
        resultImage={detection.resultImageUrl || detection.imageUrl}
        detectedItems={detection.detectedItems}
      />

      <ResultTable detectedItems={detection.detectedItems} />

      <ResultRawData data={detection.rawResult} />
    </div>
  )
}
