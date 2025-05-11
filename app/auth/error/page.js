"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    default: "Une erreur s'est produite lors de l'authentification.",
    Signin: "Tentative de connexion échouée.",
    OAuthSignin: "Tentative de connexion avec un fournisseur externe échouée.",
    OAuthCallback:
      "Erreur lors de la réponse du fournisseur d'authentification.",
    OAuthCreateAccount:
      "Erreur lors de la création du compte via le fournisseur.",
    EmailCreateAccount: "Erreur lors de la création du compte avec cet email.",
    Callback: "Erreur lors du processus d'authentification.",
    OAuthAccountNotLinked:
      "Cet email est déjà utilisé avec un autre fournisseur.",
    EmailSignin: "Erreur lors de l'envoi de l'email de connexion.",
    CredentialsSignin:
      "Les identifiants fournis ne correspondent à aucun compte.",
    SessionRequired: "Vous devez être connecté pour accéder à cette page.",
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Erreur d'authentification
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild className="w-full">
            <Link href="/auth/login">Retour à la connexion</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
