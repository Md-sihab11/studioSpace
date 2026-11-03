import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

// No hardcoded baseURL: the client calls the origin the app is served from,
// so sign-in and sessions work on localhost and in production alike.
export const authClient = createAuthClient({
    plugins: [
        jwtClient()
    ]
})

export const { signIn, signUp, useSession } = authClient
