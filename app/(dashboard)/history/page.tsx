import type { Metadata } from "next"

import { HistoryList } from "@/components/history/history-list"
import { HistoryFilters } from "@/components/history/history-filters"
import { getAllDetections } from "@/lib/data"

export const metadata: Metadata = {
  title: "Historique - PlasticDetect",
  description: "Historique des détections de déchets plastiques",
}

interface HistoryPageProps {
  searchParams: {
    page?: string
    search?: string
    type?: string
    period?: string
  }
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ""
  const type = searchParams.type || ""
  const period = searchParams.period || ""

  const { detections, totalPages, totalItems } = await getAllDetections({
    page,
    search,
    type,
    period,
    limit: 5,
  })

  return (
    <div className="space-y-8">
      <HistoryFilters />

      <HistoryList detections={detections} currentPage={page} totalPages={totalPages} totalItems={totalItems} />
    </div>
  )
}
