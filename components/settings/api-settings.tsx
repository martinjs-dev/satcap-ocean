"use client"

import { useState } from "react"
import { Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { regenerateApiKey } from "@/lib/actions"

export function ApiSettings() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("•••••••••••••••••nd6f")
  const [isApiEnabled, setIsApiEnabled] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setIsCopied(true)
    toast({
      title: "Copié !",
      description: "La clé API a été copiée dans le presse-papier",
    })

    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const newKey = await regenerateApiKey()
      setApiKey(newKey)
      toast({
        title: "Clé API régénérée",
        description: "Votre nouvelle clé API a été générée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de régénérer la clé API",
        variant: "destructive",
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">API Roboflow</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700">Statut de l'API</div>
        <Switch
          checked={isApiEnabled}
          onCheckedChange={setIsApiEnabled}
          className={isApiEnabled ? "bg-green-500" : ""}
        />
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
        <div className="text-xs text-gray-500 mb-1">Clé API actuelle</div>
        <div className="font-mono text-xs text-gray-700 flex justify-between items-center">
          <span>{apiKey}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            onClick={handleCopy}
          >
            <Copy size={14} />
          </Button>
        </div>
      </div>
      <Button
        className="h-10 w-full bg-gray-800 text-white hover:bg-gray-900 flex items-center justify-center mb-6"
        onClick={handleRegenerate}
        disabled={isRegenerating}
      >
        <RefreshCw size={16} className="mr-2" />
        {isRegenerating ? "Régénération..." : "Régénérer la clé API"}
      </Button>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          La clé API est nécessaire pour l'authentification avec le service Roboflow. Ne partagez jamais cette clé.
        </p>
      </div>
    </div>
  )
}
