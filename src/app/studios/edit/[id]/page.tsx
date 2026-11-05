"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { useToast } from "@/lib/use-toast";
import { useSession } from "@/lib/auth-client";
import type { Studio } from "@/lib/constants";
import type { StudioFormValues } from "@/component/studio-form/StudioForm";
import StudioForm from "@/component/studio-form/StudioForm";
import RequireAuth from "@/component/auth/RequireAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/constants";

const toFormValues = (studio: Studio): Partial<StudioFormValues> => ({
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: String(studio.securityDeposit),
    maxCapacity: String(studio.maxCapacity),
    location: studio.location,
    image: studio.image,
    images: studio.images ?? [],
    amenities: studio.amenities ?? [],
    overview: studio.overview,
});

/**
 * /studios/edit/[id] — pre-filled update form.
 * Loads the listing from GET /studios/:id, then StudioForm saves it
 * through PUT /update-studio/:id.
 */
const EditStudioPage = () => {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const { toast } = useToast();
    const { data: session } = useSession();

    const [initialValues, setInitialValues] = useState<Partial<StudioFormValues> | undefined>();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [notAuthorized, setNotAuthorized] = useState(false);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        (async () => {
            try {
                let studio: Studio | null = null;

                try {
                    const res = await fetch(
                        `${API_BASE_URL}/studios/${encodeURIComponent(id)}`,
                        {
                            signal: AbortSignal.timeout(60_000),
                        }
                    );

                    const data = await res.json().catch(() => null);

                    if (res.ok && data?._id) {
                        studio = data as Studio;
                    }
                } catch {
                }

                if (!studio) {
                    const res = await fetch(
                        `${API_BASE_URL}/studios`,
                        {
                            signal: AbortSignal.timeout(60_000),
                        }
                    );

                    const data = await res.json().catch(() => null);
                    

                    if (!res.ok || !Array.isArray(data)) {
                        throw new Error("Failed to load listing");
                    }

                    studio =
                        (data as Studio[]).find(
                            (item) => item && item._id === id
                        ) ?? null;
                }

                if (cancelled) return;

                if (!studio) {
                    throw new Error("Listing not found");
                }

                const ownerEmail = studio.ownerEmail?.trim().toLowerCase();
                const currentEmail = session?.user?.email?.trim().toLowerCase();

                if (ownerEmail && currentEmail && ownerEmail !== currentEmail) {
                    setNotAuthorized(true);
                    setLoading(false);
                    return;
                }

                setInitialValues(toFormValues(studio));
            } catch (error) {
                if (cancelled) return;

                console.error(error);
                setNotFound(true);

                toast({
                    title: "Could not load listing",
                    description:
                        error instanceof Error && error.name === "TimeoutError"
                            ? "The backend did not respond within 60 seconds"
                            : error instanceof Error
                              ? error.message
                              : "Please try again later.",
                    type: "error",
                });
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, toast, session?.user?.email]);

    if (notAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#131313]">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    You can only edit your own listings
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                    This studio belongs to another host. Head back to your
                    listings to update one of your own spaces.
                </p>

                <Link
                    href="/my-listings"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold transition-all hover:bg-primary/90"
                >
                    <ArrowLeft className="size-4" />
                    Back to my listings
                </Link>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#131313]">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Listing not found
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                    This listing does not exist or you don&apos;t have access to it.
                </p>

                <Link
                    href="/my-listings"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold transition-all hover:bg-primary/90"
                >
                    <ArrowLeft className="size-4" />
                    Back to my listings
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                    <Pencil className="size-5" />
                </span>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Update Studio
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Changes are saved to your listing document.
                    </p>
                </div>
            </div>

            {loading || !initialValues ? (
                <div className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#131313]">
                    <Skeleton className="h-7 w-52" />

                    <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>

                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-10 w-40 self-end" />
                </div>
            ) : (
                <StudioForm
                    mode="edit"
                    studioId={id}
                    initialValues={initialValues}
                />
            )}
        </div>
    );
};

const EditStudioPageWithAuth = () => (
    <RequireAuth>
        <EditStudioPage />
    </RequireAuth>
);

export default EditStudioPageWithAuth;
