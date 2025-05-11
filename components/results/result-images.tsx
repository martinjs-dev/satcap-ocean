"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

interface DetectedItem {
  id: string
  class: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
}

interface ResultImagesProps {
  originalImage: string
  resultImage: string
  detectedItems: DetectedItem[]
}

export function ResultImages({ originalImage, resultImage, detectedItems }: ResultImagesProps) {
  const [isOriginalLoaded, setIsOriginalLoaded] = useState(false)
  const [isResultLoaded, setIsResultLoaded] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Image originale</h2>
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden relative">
          {!isOriginalLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          {originalImage ? (
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Image originale"
              className="max-h-full max-w-full object-contain"
              onLoad={() => setIsOriginalLoaded(true)}
              style={{ display: isOriginalLoaded ? "block" : "none" }}
            />
          ) : (
            <div className="h-64 w-64 bg-blue-50 rounded flex items-center justify-center">
              <ImageIcon size={48} className="text-blue-300" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Objets détectés ({detectedItems.length})</h2>
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden relative">
          {!isResultLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          {resultImage ? (
            <img
              src={resultImage || "/placeholder.svg"}
              alt="Objets détectés"
              className="max-h-full max-w-full object-contain"
              onLoad={() => setIsResultLoaded(true)}
              style={{ display: isResultLoaded ? "block" : "none" }}
            />
          ) : (
            <div className="h-64 w-64 bg-blue-50 rounded flex items-center justify-center">
              <ImageIcon size={48} className="text-blue-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
