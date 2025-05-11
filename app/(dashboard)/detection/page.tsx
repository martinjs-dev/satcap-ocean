import type { Metadata } from "next"

import { UploadForm } from "@/components/detection/upload-form"

export const metadata: Metadata = {
  title: "Détection - SatCap - Ocean",
  description: "Téléchargez une image pour détecter les déchets plastiques",
}

export default function DetectionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <UploadForm />
    </div>
  )
}
