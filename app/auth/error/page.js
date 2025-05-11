"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Composant client qui utilise useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  useEffect(() => {
    const error = searchParams.get("error")
    
    // Traduire les codes d'erreur en messages utilisateur
    if (error === "CredentialsSignin") {
      setErrorMessage("Les identifiants fournis sont incorrects.")
    } else if (error === "AccessDenied") {
      setErrorMessage("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.")
    } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") {
      setErrorMessage("Une erreur est survenue lors de l'authentification avec le fournisseur externe.")
    } else if (error === "EmailCreateAccount" || error === "Callback" || error === "EmailSignin") {
      setErrorMessage("Une erreur est survenue lors de l'authentification par email.")
    } else if (error === "SessionRequired") {
      setErrorMessage("Vous devez être connecté pour accéder à cette page.")
    } else {
      setErrorMessage("Une erreur inconnue est survenue lors de l'authentification.")
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur d'authentification</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/auth/login">Retour à la page de connexion</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Page principale avec Suspense
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}