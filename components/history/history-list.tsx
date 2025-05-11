"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, ImageIcon, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { deleteDetection } from "@/lib/actions"

interface Detection {
  id: string
  createdAt: Date
  imageUrl: string
  objectCount: number
  confidence: number
}

interface HistoryListProps {
  detections: Detection[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export function HistoryList({ detections, currentPage, totalPages, totalItems }: HistoryListProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [detectionToDelete, setDetectionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!detectionToDelete) return

    setIsDeleting(true)
    try {
      await deleteDetection(detectionToDelete)
      toast({
        title: "Supprimé avec succès",
        description: "La détection a été supprimée",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la détection",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDetectionToDelete(null)
    }
  }

  const confirmDelete = (id: string) => {
    setDetectionToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-4">Image</div>
          <div className="col-span-2">Objets</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1">Actions</div>
        </div>

        {detections.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucune détection trouvée</div>
        ) : (
          detections.map((detection) => (
            <div
              key={detection.id}
              className="grid grid-cols-12 p-4 border-b border-gray-100 items-center hover:bg-gray-50"
            >
              <div className="col-span-1 text-sm font-medium text-gray-700">DT-{detection.id.substring(0, 4)}</div>
              <div className="col-span-2 text-sm text-gray-600">{formatDate(detection.createdAt)}</div>
              <div className="col-span-4 flex items-center">
                <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 mr-3 overflow-hidden">
                  {detection.imageUrl ? (
                    <img
                      src={detection.imageUrl || "/placeholder.svg"}
                      alt={`Détection ${detection.id}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={18} />
                  )}
                </div>
                <div className="text-sm text-gray-700">Analyse du {formatDate(detection.createdAt, true)}</div>
              </div>
              <div className="col-span-2 text-sm text-gray-700">{detection.objectCount} objets</div>
              <div className="col-span-2">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {Math.round(detection.confidence * 100)}% confiance
                </div>
              </div>
              <div className="col-span-1 flex justify-end space-x-2">
                <Link href={`/results/${detection.id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  >
                    <Eye size={16} />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/results/${detection.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Voir les détails</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => confirmDelete(detection.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={5} />
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement cette détection et toutes les
              données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
