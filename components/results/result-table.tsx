interface DetectedItem {
  id: string
  class: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
}

interface ResultTableProps {
  detectedItems: DetectedItem[]
}

export function ResultTable({ detectedItems }: ResultTableProps) {
  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 0.7) return "bg-green-100 text-green-800"
    if (confidence >= 0.5) return "bg-blue-100 text-blue-800"
    return "bg-amber-100 text-amber-800"
  }

  // Fonction pour formater le nom de la classe
  const formatClassName = (className: string) => {
    return className
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Déchets détectés ({detectedItems.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confiance</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position X</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position Y</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {detectedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-sm text-gray-500">
                  Aucun objet détecté
                </td>
              </tr>
            ) : (
              detectedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{formatClassName(item.class)}</td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceClass(item.confidence)}`}
                    >
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-800">{Math.round(item.x)}</td>
                  <td className="p-3 text-sm text-gray-800">{Math.round(item.y)}</td>
                  <td className="p-3 text-sm text-gray-800">
                    {Math.round(item.width)} x {Math.round(item.height)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
