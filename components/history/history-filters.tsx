"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function HistoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [period, setPeriod] = useState(searchParams.get("period") || "week")

  const handleFilter = () => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (type) params.set("type", type)
      if (period) params.set("period", period)

      router.push(`/history?${params.toString()}`)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 h-10 w-full bg-gray-50 border border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-40">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-10 bg-gray-50 border border-gray-300">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="bouteille">Bouteilles</SelectItem>
              <SelectItem value="sac">Sacs</SelectItem>
              <SelectItem value="gobelet">Gobelets</SelectItem>
              <SelectItem value="emballage">Emballages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-10 bg-gray-50 border border-gray-300">
              <SelectValue placeholder="Cette semaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois-ci</SelectItem>
              <SelectItem value="all">Tous les temps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 flex items-center space-x-1"
          onClick={handleFilter}
          disabled={isPending}
        >
          <Filter size={16} />
          <span>Filtrer</span>
        </Button>
      </div>
    </div>
  )
}
