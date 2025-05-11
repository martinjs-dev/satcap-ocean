"use client"

import { useState } from "react"
import { Copy, ChevronRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ResultRawDataProps {
  data: string
}

export function ResultRawData({ data }: ResultRawDataProps) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})

  const handleCopy = () => {
    navigator.clipboard.writeText(data)
    setIsCopied(true)
    toast({
      title: "Copié !",
      description: "Les données JSON ont été copiées dans le presse-papier",
    })

    setTimeout(() => setIsCopied(false), 2000)
  }

  const toggleField = (path: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  // Cette fonction formate récursivement le JSON pour l'affichage
  const renderJSON = (obj: any, level = 0, path = ""): JSX.Element => {
    if (obj === null) return <span className="text-gray-500">null</span>
    
    if (typeof obj === "undefined") return <span className="text-gray-500">undefined</span>
    
    if (typeof obj === "string") {
      // Détecter les chaînes longues (probablement base64)
      if (obj.length > 100) {
        const isExpanded = expandedFields[path] || false
        const displayString = isExpanded ? obj : obj.substring(0, 50) + "..."
        
        return (
          <div className="inline-flex flex-col w-full">
            <div className="flex items-start">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 mr-1 text-gray-500"
                onClick={() => toggleField(path)}
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </Button>
              <span className="text-green-600">
                "{displayString}"
                {!isExpanded && (
                  <span className="text-blue-500 cursor-pointer hover:underline ml-1" onClick={() => toggleField(path)}>
                    ({obj.length} caractères)
                  </span>
                )}
              </span>
            </div>
          </div>
        )
      }
      
      return <span className="text-green-600">"{obj}"</span>
    }
    
    if (typeof obj === "number") return <span className="text-blue-600">{obj}</span>
    
    if (typeof obj === "boolean") return <span className="text-orange-600">{obj ? "true" : "false"}</span>
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span className="text-gray-500">[]</span>
      
      const isExpanded = expandedFields[path] !== false // Par défaut, les tableaux sont déployés
      
      return (
        <div className="inline-flex flex-col">
          <div className="flex items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 mr-1 text-gray-500"
              onClick={() => toggleField(path)}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </Button>
            <span>{"["}</span>
          </div>
          
          {isExpanded && (
            <div style={{ marginLeft: 16 }}>
              {obj.map((item, index) => (
                <div key={`${path}-${index}`} className="flex">
                  {renderJSON(item, level + 1, `${path}[${index}]`)}
                  {index < obj.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
          )}
          
          {isExpanded ? (
            <div>
              {"]"}
            </div>
          ) : (
            <span className="ml-1">... {obj.length} items]</span>
          )}
        </div>
      )
    }
    
    if (typeof obj === "object") {
      const keys = Object.keys(obj)
      
      if (keys.length === 0) return <span className="text-gray-500">{"{}"}</span>
      
      const isExpanded = expandedFields[path] !== false // Par défaut, les objets sont déployés
      
      return (
        <div className="inline-flex flex-col">
          <div className="flex items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 mr-1 text-gray-500"
              onClick={() => toggleField(path)}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </Button>
            <span>{"{"}</span>
          </div>
          
          {isExpanded && (
            <div style={{ marginLeft: 16 }}>
              {keys.map((key, index) => (
                <div key={`${path}-${key}`} className="flex">
                  <span className="text-purple-600">"{key}"</span>
                  <span className="mr-1">: </span>
                  {renderJSON(obj[key], level + 1, path ? `${path}.${key}` : key)}
                  {index < keys.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
          )}
          
          {isExpanded ? (
            <div>
              {"}"}
            </div>
          ) : (
            <span className="ml-1">... {keys.length} propriétés}</span>
          )}
        </div>
      )
    }
    
    return <span>{String(obj)}</span>
  }

  let formattedData
  try {
    const jsonObj = JSON.parse(data)
    formattedData = renderJSON(jsonObj)
  } catch (e) {
    formattedData = <div className="text-red-500">Erreur lors du parsing JSON: {String(e)}</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Données JSON brutes</h2>
        <Button variant="outline" size="sm" className="text-gray-500 hover:text-gray-700" onClick={handleCopy}>
          <Copy size={14} className="mr-1" />
          {isCopied ? "Copié !" : "Copier"}
        </Button>
      </div>
      <div className="bg-gray-100 p-4 rounded-md max-h-80 overflow-auto text-xs font-mono text-gray-800">
        {data ? formattedData : <div className="text-gray-500">Aucune donnée disponible</div>}
      </div>
    </div>
  )
}