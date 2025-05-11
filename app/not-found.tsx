import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            404
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page non trouvée</h1>
        <p className="text-gray-500 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700">Retour au dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
