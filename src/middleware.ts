import { NextResponse } from 'next/server'
import { auth } from "./lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

}
export const config = {
    matcher: [
        "/api/studios",
        "/api/add-studio",
        "/api/studios/:id",
        "/api/my-bookings",
    ],
};

