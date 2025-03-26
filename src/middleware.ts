import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
const secret = process.env.AUTH_SECRET
export async function middleware(req: NextRequest) {
  // Get the pathname from the URL
  const path = req.nextUrl.pathname
  const token = await getToken({ req, secret })
  
  // Check if the path is an admin route
  if (path.startsWith('/admin')) {
    // Get authentication token from cookies

    if (!token) {
      // Redirect to login page if no token exists
      const url = new URL('/auth', req.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }

    // Verify admin role/permissions
    try {
      // // This is a placeholder for your actual token verification logic
      // const isAdmin = await verifyAdminToken(token)

      if (token.role !== 'admin') {
        // Redirect to unauthorized page or homepage if not an admin
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Allow access if admin
      return NextResponse.next()
    } catch (error) {
      console.error('Error verifying token:', error)
      // Handle verification errors (expired token, invalid signature, etc.)
      const url = new URL('/auth', req.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }
  }

  // Continue for non-admin routes
  return NextResponse.next()
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
