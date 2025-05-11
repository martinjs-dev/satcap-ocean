"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems)

  return (
    <div className="p-4 flex justify-between items-center border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Affichage de {totalItems > 0 ? startItem : 0} à {endItem} sur {totalItems} résultats
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-300"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={createPageURL(currentPage - 1)}>
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <ChevronLeft size={16} />
          )}
        </Button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // Show pages around current page
          let pageNumber: number
          if (totalPages <= 5) {
            pageNumber = i + 1
          } else if (currentPage <= 3) {
            pageNumber = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i
          } else {
            pageNumber = currentPage - 2 + i
          }

          const isCurrentPage = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? "default" : "outline"}
              size="icon"
              className={`h-8 w-8 ${
                isCurrentPage
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              asChild={!isCurrentPage}
            >
              {isCurrentPage ? pageNumber : <Link href={createPageURL(pageNumber)}>{pageNumber}</Link>}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-300"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={createPageURL(currentPage + 1)}>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <ChevronRight size={16} />
          )}
        </Button>
      </div>
    </div>
  )
}

export const PaginationContent = () => null
export const PaginationItem = () => null
export const PaginationLink = () => null
export const PaginationEllipsis = () => null
export const PaginationPrevious = () => null
export const PaginationNext = () => null
