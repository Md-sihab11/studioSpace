"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutGrid, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { getJwtToken, useSession } from "@/lib/auth-client";
import { useToast } from "@/lib/use-toast";
import { API_BASE_URL, type Studio } from "@/lib/constants";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

const MyListingsPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, isPending: sessionPending } = useSession();

    const [listings, setListings] = useState<Studio[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Studio | null>(null);

    const signedIn = !!session?.user;
    const loading = sessionPending || (signedIn && !loaded);

    useEffect(() => {
        if (sessionPending || !session?.user) return;

        const ownerEmail = session.user.email;
        let cancelled = false;

        (async () => {
            try {
                const token = await getJwtToken();

                // GET /my-listings/:email
                const res = await fetch(
                    `${API_BASE_URL}/my-listings/${encodeURIComponent(ownerEmail)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json().catch(() => null);

                if (cancelled) return;

                if (!res.ok || !Array.isArray(data)) {
                    throw new Error("Failed to load listings");
                }

                setListings(
                    (data as Studio[]).map((studio) => ({
                        ...studio,
                        image: studio.image ?? studio.imageUrl ?? "",
                    }))
                );
            } catch (error) {
                if (cancelled) return;

                toast({
                    title: "Could not load listings",
                    description:
                        error instanceof Error ? error.message : "Please try again later.",
                    type: "error",
                });
            } finally {
                if (!cancelled) setLoaded(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [session, sessionPending, toast]);

    const handleDelete = async () => {
        if (!pendingDelete) return;

        setDeleting(true);

        try {
            const token = await getJwtToken();

            const res = await fetch(
                `${API_BASE_URL}/delete-studio/${pendingDelete._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.success === false) {
                throw new Error(data?.message || "Failed to delete listing");
            }

            setListings((prev) =>
                prev.filter((s) => s._id !== pendingDelete._id)
            );

            toast({
                title: "Listing deleted",
                description: `"${pendingDelete.title}" has been removed.`,
                type: "success",
            });

            setPendingDelete(null);
        } catch (error) {
            toast({
                title: "Could not delete listing",
                description:
                    error instanceof Error ? error.message : "Please try again.",
                type: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    const heading = (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Studio Listings
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage the spaces you host on StudioSpace.
                </p>
            </div>

            <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
            >
                <Plus className="size-4" />
                Add New Studio
            </Link>
        </div>
    );

    const showEmpty = !loading && !sessionPending && listings.length === 0;

    return (
        <div className="flex flex-col gap-6">
            {heading}

            {/* Signed out */}
            {!sessionPending && !session?.user && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#131313]">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Sign in to see your listings
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                        Your studios are tied to your account. Sign in to manage them.
                    </p>

                    <Link
                        href="/login"
                        className="mt-5 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold transition-all hover:bg-primary/90"
                    >
                        Sign in
                    </Link>
                </div>
            )}

            {/* Loading skeletons */}
            {(loading || sessionPending) && (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#131313]"
                        >
                            <Skeleton className="size-20 shrink-0 rounded-xl" />

                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-72" />
                            </div>

                            <Skeleton className="hidden h-8 w-28 rounded-full sm:block" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {showEmpty && session?.user && (
                <Empty className="border border-dashed border-gray-200 bg-white py-24 dark:border-white/10 dark:bg-[#131313]">
                    <EmptyHeader>
                        <EmptyMedia>
                            <span className="flex size-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-600 shadow-sm dark:bg-sky-500/10 dark:text-sky-400">
                                <LayoutGrid className="size-9" strokeWidth={1.5} />
                            </span>
                        </EmptyMedia>

                        <EmptyTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            No listings yet
                        </EmptyTitle>

                        <EmptyDescription className="max-w-sm text-sm leading-6">
                            Studios you list as a host will appear here. Manage photos, set
                            your pricing and availability, and start earning from your space —
                            all in one place.
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent>
                        <Link
                            id="add-studio-from-listings"
                            href="/add-studio"
                            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
                        >
                            <Plus className="size-4" />
                            List Your Studio
                        </Link>

                        <Link
                            href="/#trust"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                        >
                            Learn about hosting
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </EmptyContent>
                </Empty>
            )}

            {/* Row list */}
            {!loading && !sessionPending && listings.length > 0 && (
                <div className="flex flex-col gap-4">
                    {listings.map((studio) => (
                        <div
                            key={studio._id}
                            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#131313] sm:flex-row sm:items-center"
                        >
                            {/* Thumbnail + identity */}
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={studio.image}
                                    alt={studio.title}
                                    className="size-20 shrink-0 rounded-xl object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                                            {studio.title}
                                        </h2>

                                        <Badge variant="secondary">
                                            {studio.category}
                                        </Badge>
                                    </div>

                                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="size-3.5 shrink-0" />
                                        <span className="truncate">
                                            {studio.location}
                                        </span>
                                    </p>

                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                        <Users className="size-3.5 shrink-0" />
                                        Up to {studio.maxCapacity} guests
                                    </p>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="flex shrink-0 flex-wrap items-baseline gap-x-4 gap-y-1 sm:flex-col sm:items-end sm:gap-1">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ${studio.hourlyRate}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                        /hr
                                    </span>
                                </span>

                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ${studio.securityDeposit} deposit
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 gap-2 sm:ml-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.push(`/studios/edit/${studio._id}`)
                                    }
                                >
                                    <Pencil />
                                    Update
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setPendingDelete(studio)}
                                >
                                    <Trash2 />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete confirmation */}
            <AlertDialog
                open={!!pendingDelete}
                onOpenChange={(open) => {
                    if (!open && !deleting) setPendingDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete this listing?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {pendingDelete
                                ? `"${pendingDelete.title}" will be permanently removed from MongoDB. This action cannot be undone.`
                                : "This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleDelete();
                            }}
                            disabled={deleting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MyListingsPage;
