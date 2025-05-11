import type { Metadata } from "next"

import { StatsCards } from "@/components/dashboard/stats-cards"
import { TypesChart } from "@/components/dashboard/types-chart"
import { ConfidenceChart } from "@/components/dashboard/confidence-chart"
import { RecentDetections } from "@/components/dashboard/recent-detections"
import { getDetectionStats, getRecentDetections } from "@/lib/data"

export const metadata: Metadata = {
  title: "Dashboard - SatCap - Ocean",
  description: "Tableau de bord pour la détection et l'analyse de déchets plastiques",
}

export default async function DashboardPage() {
  const stats = await getDetectionStats()
  const recentDetections = await getRecentDetections(3)

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TypesChart data={stats.typeDistribution} />
        <ConfidenceChart data={stats.confidenceDistribution} />
      </div>
      <RecentDetections detections={recentDetections} />
    </div>
  )
}
