import { ArrowUpRight, Clipboard, CircleCheck, AlertTriangle, Trash2 } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalDetections: number
    totalObjects: number
    averageConfidence: number
    mainType: {
      name: string
      percentage: number
    }
    monthlyGrowth: {
      detections: number
      objects: number
      confidence: number
    }
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm font-medium text-gray-500">Total des analyses</div>
          <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Clipboard size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalDetections}</div>
        <div className="text-sm text-gray-500 flex items-center">
          <ArrowUpRight size={14} className="text-green-500 mr-1" />
          <span className="text-green-500 font-medium">{stats.monthlyGrowth.detections}%</span>
          <span className="ml-1">ce mois</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm font-medium text-gray-500">Objets détectés</div>
          <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Trash2 size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalObjects}</div>
        <div className="text-sm text-gray-500 flex items-center">
          <ArrowUpRight size={14} className="text-green-500 mr-1" />
          <span className="text-green-500 font-medium">{stats.monthlyGrowth.objects}%</span>
          <span className="ml-1">vs. dernier mois</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm font-medium text-gray-500">Confiance moyenne</div>
          <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <CircleCheck size={16} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">{stats.averageConfidence}%</div>
        <div className="text-sm text-gray-500 flex items-center">
          <ArrowUpRight size={14} className="text-green-500 mr-1" />
          <span className="text-green-500 font-medium">{stats.monthlyGrowth.confidence}%</span>
          <span className="ml-1">vs. dernier mois</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm font-medium text-gray-500">Type principal</div>
          <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={16} />
          </div>
        </div>
        <div className="text-xl font-bold text-gray-800 mb-1">{stats.mainType.name}</div>
        <div className="text-sm text-gray-500 flex items-center">
          <span>{stats.mainType.percentage}% des détections</span>
        </div>
      </div>
    </div>
  )
}
