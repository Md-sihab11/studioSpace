import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// No baseURL here: the client must talk to the origin the app is served from
// so the session cookie is included. BETTER_AUTH_URL is a server-only env var.
export const authClient = createAuthClient({
    plugins: [
        jwtClient(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;


export async function getJwtToken(): Promise<string> {
    const { data, error } = await authClient.$fetch<
        { token: string },
        { message?: string }
    >("/token");

    if (error || !data?.token) {
        throw new Error(error?.message ?? "Please sign in again.");
    }

    return data.token;
}
