// middleware.ts
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  // Vérifier si la page est une page d'authentification
  const isAuthPage = pathname.startsWith("/auth/")

  // Rediriger vers le login si non authentifié et pas sur une page d'auth
  if (!token && !isAuthPage) {
    const url = new URL("/auth/login", req.url)
    return NextResponse.redirect(url)
  }

  // Rediriger vers le dashboard si authentifié et sur une page d'auth
  if (token && isAuthPage) {
    const url = new URL("/dashboard", req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}