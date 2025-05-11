"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Camera, Search, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { uploadImage } from "@/lib/cloudinary"
import { detectObjects } from "@/lib/roboflow"

export function UploadForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setError(null)

      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      toast({
        title: "Image sélectionnée",
        description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`,
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  })

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 200)
    return interval
  }

  const handleDetection = async () => {
    if (!file || !preview) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      })
      return
    }

    try {
      setError(null)
      setIsUploading(true)
      const progressInterval = simulateProgress()

      // Upload to Cloudinary
      const uploadResult = await uploadImage(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        setIsUploading(false)
        setIsDetecting(true)
      }, 500)

      if (!uploadResult.url) {
        throw new Error("Échec du téléchargement de l'image")
      }

      // Call Roboflow API
      const detectionResult = await detectObjects(uploadResult.url)
      setIsDetecting(false)

      if (detectionResult.id === "no-detection") {
        toast({
          title: "Aucun déchet détecté",
          description: "Aucun déchet plastique n'a été détecté dans cette image.",
          variant: "warning",
        })
        return
      }

      if (!detectionResult.id) {
        throw new Error("Échec de la détection")
      }

      // Redirect to results page
      router.push(`/results/${detectionResult.id}`)
    } catch (error) {
      setIsUploading(false)
      setIsDetecting(false)
      setUploadProgress(0)

      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"

      // Vérifier si l'erreur concerne le workflow
      if (errorMessage.includes("workflow") || errorMessage.includes("404")) {
        setError(
          "Le workflow Roboflow spécifié n'existe pas ou n'est pas accessible. Veuillez contacter l'administrateur.",
        )
      } else {
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de configuration</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
          }`}
        >
          <input {...getInputProps()} />
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-4 flex items-center justify-center">
            <Upload size={28} />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-1">
            {isDragActive ? "Déposez l'image ici" : "Glissez une image ou cliquez pour choisir"}
          </p>
          <p className="text-sm text-gray-500 mb-6">PNG, JPG jusqu'à 10MB</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Parcourir les fichiers</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Aperçu de l'image</h2>
        <div className="h-64 w-full bg-gray-100 rounded-lg mb-6 flex items-center justify-center border border-gray-200 overflow-hidden">
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Aperçu" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-center text-gray-500">
              <Camera size={32} className="mx-auto mb-2" />
              <p>Aucune image sélectionnée</p>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Téléchargement en cours...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <div className="flex justify-center">
          <Button
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={handleDetection}
            disabled={!file || isUploading || isDetecting}
          >
            {isUploading ? (
              <>Téléchargement...</>
            ) : isDetecting ? (
              <>Analyse en cours...</>
            ) : (
              <>
                <Search className="mr-2" size={18} />
                Lancer la détection
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
