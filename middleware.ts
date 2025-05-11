// middleware.ts
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Permettre l'accès aux ressources publiques
  const publicPaths = ["/", "/about", "/contact"];
  const isPublicPath = publicPaths.some(path => pathname === path);
  
  // Vérifier si la page est une page d'authentification
  const isAuthPage = pathname.startsWith("/auth/");

  // Rediriger vers le login si non authentifié et pas sur une page publique ou d'auth
  if (!token && !isAuthPage && !isPublicPath) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Rediriger vers le dashboard si authentifié et sur une page d'auth
  if (token && isAuthPage) {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};