"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Bell, ChevronDown, LogOut, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Fonction pour obtenir le titre de la page en fonction du chemin
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard"
      case "/detection":
        return "Détection"
      case "/history":
        return "Historique des Détections"
      case "/settings":
        return "Paramètres"
      default:
        if (pathname.startsWith("/results/")) {
          return "Résultats de Détection"
        }
        return "Dashboard"
    }
  }

  return (
    <header className="flex justify-between items-center h-16 px-8 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800">
          <Bell size={18} />
        </Button>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                AD
              </div>
              <span className="text-gray-700 font-medium">Admin</span>
              <ChevronDown size={16} className="text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
