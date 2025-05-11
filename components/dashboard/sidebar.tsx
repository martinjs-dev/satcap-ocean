"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, History, Home, Settings, Upload } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/detection", icon: Upload, label: "Détection" },
    { href: "/history", icon: History, label: "Historique" },
    { href: "/settings", icon: Settings, label: "Paramètres" },
  ]

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <Database size={18} />
          </div>
          <span className="font-bold text-gray-800">SatCap - Ocean</span>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 rounded-md px-3 py-2 ${
                isActive(item.href) ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
