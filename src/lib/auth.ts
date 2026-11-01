import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "@/lib/db";

const db = client.db("studiospace");

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
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});