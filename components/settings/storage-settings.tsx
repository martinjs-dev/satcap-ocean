"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { clearStorage } from "@/lib/actions"
import { getStorageStats } from "@/lib/cloudinary"

interface StorageStats {
  usagePercentage: number
  usedStorage: number
  totalStorage: number
  resources: number
}

export function StorageSettings() {
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<StorageStats>({
    usagePercentage: 0,
    usedStorage: 0,
    totalStorage: 10 * 1024, // 10 GB en MB
    resources: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)
        const data = await getStorageStats()
        setStats(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les statistiques de stockage",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const handleClearStorage = async () => {
    setIsClearing(true)
    try {
      await clearStorage()
      // Rafraîchir les statistiques
      const data = await getStorageStats()
      setStats(data)

      toast({
        title: "Stockage nettoyé",
        description: "Les anciennes images ont été supprimées avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de nettoyer le stockage",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  // Convertir MB en GB avec 1 décimale
  const usedStorageGB = (stats.usedStorage / 1024).toFixed(1)
  const totalStorageGB = (stats.totalStorage / 1024).toFixed(1)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Stockage Cloudinary</h2>
      <div className="mb-6">
        <div className="w-36 h-36 mx-auto relative mb-4">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray={`${stats.usagePercentage * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-gray-800">{stats.usagePercentage}%</span>
                <span className="text-sm text-gray-500">utilisé</span>
              </div>
            </>
          )}
        </div>
        <div className="text-center text-sm text-gray-600 font-medium">
          {usedStorageGB} Go / {totalStorageGB} Go
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">{stats.resources} ressources stockées</div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-4">
          {stats.usagePercentage > 80
            ? "Votre espace de stockage est presque plein. Vous pouvez supprimer d'anciennes images ou mettre à niveau votre plan."
            : "Gérez votre espace de stockage en supprimant les anciennes images qui ne sont plus nécessaires."}
        </p>
        <Button
          className="h-10 w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
          onClick={handleClearStorage}
          disabled={isClearing || isLoading}
        >
          <Trash2 size={16} className="mr-2" />
          {isClearing ? "Nettoyage..." : "Nettoyer le stockage"}
        </Button>
      </div>
    </div>
  )
}
