"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ConfidenceChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
}

export function ConfidenceChart({ data }: ConfidenceChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-lg font-medium text-gray-800 mb-4">Distribution des niveaux de confiance</div>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} objets`, "Quantité"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
