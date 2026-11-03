import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "@/lib/db";

const db = client.db("studiospace");

/**
 * A social provider is only registered when both credentials exist in .env.
 * Registering one with missing values makes Better Auth warn on every startup
 * and returns a 500 from POST /api/auth/sign-in/social.
 */
const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        // No SMTP creds configured yet — reset links are printed to this
        // terminal. TODO: send via nodemailer/Gmail once .env has
        // EMAIL_USER + EMAIL_APP_PASSWORD.
        sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
            console.log(`\n🔐 Password reset link for ${user.email}:\n${url}\n`);
        },
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
        jwt()
    ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 7 * 24 * 60 * 60
        }
    }
});