import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "@/lib/db";

const db = client.db("studiospace");

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    baseURL: process.env.BETTER_AUTH_URL!,
    socialProviders: {
        ...(googleId && googleSecret
            ? { google: { clientId: googleId, clientSecret: googleSecret } }
            : {}),
        ...(githubId && githubSecret
            ? { github: { clientId: githubId, clientSecret: githubSecret } }
            : {}),
    },
    database: mongodbAdapter(db, {
        client,
    }),

    plugins: [
        jwt({ sessionCookieCache: true }),
    ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 7 * 24 * 60 * 60
        }
    }
});