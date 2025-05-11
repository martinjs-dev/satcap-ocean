import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Connexion - SatCap - Ocean",
  description: "Connectez-vous à votre compte SatCap - Ocean",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            DP
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Dashboard Détection Plastique</h1>
        <p className="text-center text-gray-500 mb-6">Connectez-vous pour accéder au tableau de bord</p>
        <LoginForm />
      </div>
    </div>
  )
}
