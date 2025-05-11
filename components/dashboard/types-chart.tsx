"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TypesChartProps {
  data: {
    name: string
    count: number
  }[]
}

export function TypesChart({ data }: TypesChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-lg font-medium text-gray-800 mb-4">Types de déchets détectés</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} objets`, "Quantité"]}
              labelFormatter={(label) => `Type: ${label}`}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
