"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Aperture } from "lucide-react";
import { useSession } from "@/lib/auth-client";

/**
 * Client-side guard for private routes.
 *
 * It never redirects while the session is still loading, so a signed-in user
 * reloading a private page stays on that page instead of being bounced to
 * /login. Signed-out visitors are sent to /login with a return path.
 */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending || session?.user) return;

        const redirect = encodeURIComponent(pathname);
        router.replace(`/login?redirect=${redirect}`);
    }, [isPending, session, pathname, router]);

    if (isPending || !session?.user) {
        return (
            <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-sky-500/10">
                    <Aperture className="size-8 animate-spin text-teal-600 dark:text-sky-400" />
                </span>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Checking your session…
                </p>
            </main>
        );
    }

    return <>{children}</>;
};

export default RequireAuth;
