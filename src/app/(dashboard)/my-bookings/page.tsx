"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarClock,
    Clock,
    MapPin,
    X,
    Search,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { getJwtToken, useSession } from "@/lib/auth-client";
import { API_BASE_URL } from "@/lib/constants";
import { useToast } from "@/lib/use-toast";
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

/** One row of the backend `bookings` collection. */
type Booking = {
    _id: string;
    studioId: string;
    studioTitle: string;
    studioImage?: string;
    studioLocation?: string;
    hourlyRate: number;
    userEmail: string;
    userName?: string;
    date: string;
    startTime: string;
    hours: number;
    total: number;
    notes?: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    createdAt: string;
};

/** Colour per status badge. */
const STATUS_STYLES: Record<Booking["status"], string> = {
    Pending:
        "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30",
    Confirmed:
        "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30",
    Completed:
        "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/30",
    Cancelled:
        "bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30",
};

const StatusBadge = ({ status }: { status: Booking["status"] }) => (
    <span
        className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[status] ?? STATUS_STYLES.Pending}`}
    >
        {status}
    </span>
);

/**
 * /my-bookings — every reservation of the signed-in user.
 * Data comes from GET /my-bookings/:email; cancelling uses
 * PATCH /cancel-booking/:id (only Pending bookings can change).
 */
const MyBookingsPage = () => {
    const { toast } = useToast();
    const { data: session, isPending: sessionPending } = useSession();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);

    const signedIn = !!session?.user;
    const loading = sessionPending || (signedIn && !loaded);

    useEffect(() => {
        if (sessionPending || !session?.user) return;

        const email = session.user.email;
        let cancelled = false;

        (async () => {
            try {
                const token = await getJwtToken();

                const res = await fetch(
                    `${API_BASE_URL}/my-bookings/${encodeURIComponent(email)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json().catch(() => null);

                if (cancelled) return;

                if (!res.ok || !Array.isArray(data)) {
                    throw new Error(
                        data?.message || "Failed to load bookings"
                    );
                }

                // Backend returns natural order — show newest bookings first.
                setBookings(
                    [...(data as Booking[])].sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    )
                );
            } catch (error) {
                if (cancelled) return;

                toast({
                    title: "Could not load bookings",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Please try again later.",
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

    /* Cancel a Pending booking after the user confirms it. */
    const handleCancel = async () => {
        if (!pendingCancel) return;

        setCancelling(true);

        try {
            const token = await getJwtToken();

            // PATCH /cancel-booking/:id
            const res = await fetch(
                `${API_BASE_URL}/cancel-booking/${pendingCancel._id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.success === false) {
                throw new Error(
                    data?.message || "Failed to cancel booking"
                );
            }

            // matchedCount 0 → the booking left the Pending state meanwhile.
            if (data?.matchedCount === 0) {
                throw new Error(
                    "This booking can no longer be cancelled"
                );
            }

            // Flip this booking's badge to Cancelled without refetching.
            setBookings((prev) =>
                prev.map((booking) =>
                    booking._id === pendingCancel._id
                        ? { ...booking, status: "Cancelled" }
                        : booking
                )
            );

            toast({
                title: "Booking cancelled",
                description: `Your reservation for "${pendingCancel.studioTitle}" is now cancelled.`,
                type: "success",
            });

            setPendingCancel(null);
        } catch (error) {
            toast({
                title: "Could not cancel booking",
                description:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                type: "error",
            });
        } finally {
            setCancelling(false);
        }
    };

    const heading = (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Bookings
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track and manage your studio reservations.
            </p>
        </div>
    );

    const showEmpty =
        !loading && !sessionPending && bookings.length === 0;

    return (
        <div className="flex flex-col gap-6">
            {heading}

            {/* Signed out */}
            {!sessionPending && !session?.user && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#131313]">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Sign in to see your bookings
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                        Your reservations are tied to your account. Sign in to view and
                        manage them.
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
                                <CalendarClock
                                    className="size-9"
                                    strokeWidth={1.5}
                                />
                            </span>
                        </EmptyMedia>

                        <EmptyTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            No bookings yet
                        </EmptyTitle>

                        <EmptyDescription className="max-w-sm text-sm leading-6">
                            Your upcoming and past studio sessions will appear here once you
                            make your first booking. Discover verified creative spaces and
                            book by the hour — instant confirmation, no fuss.
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent>
                        <Link
                            id="browse-studios-from-bookings"
                            href="/studios"
                            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
                        >
                            <Search className="size-4" />
                            Browse Studios
                        </Link>

                        <Link
                            href="/#categories"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                        >
                            Explore categories
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </EmptyContent>
                </Empty>
            )}

            {/* Booking list */}
            {!loading && !sessionPending && bookings.length > 0 && (
                <div className="flex flex-col gap-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#131313] sm:flex-row sm:items-center"
                        >
                            {/* Thumbnail + identity */}
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                {booking.studioImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={booking.studioImage}
                                        alt={booking.studioTitle}
                                        className="size-20 shrink-0 rounded-xl object-cover"
                                        onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <span className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-sky-500/10 dark:text-sky-400">
                                        <CalendarClock
                                            className="size-8"
                                            strokeWidth={1.5}
                                        />
                                    </span>
                                )}

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                                            {booking.studioTitle}
                                        </h2>

                                        <StatusBadge status={booking.status} />
                                    </div>

                                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="size-3.5 shrink-0" />

                                        <span className="truncate">
                                            {booking.studioLocation || "Location not set"}
                                        </span>
                                    </p>

                                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarClock className="size-3.5 shrink-0" />
                                            {booking.date} at {booking.startTime}
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Clock className="size-3.5 shrink-0" />
                                            {booking.hours}{" "}
                                            {booking.hours === 1 ? "hour" : "hours"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex shrink-0 flex-col items-start gap-0.5 sm:items-end">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ${booking.total}
                                </span>

                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ${booking.hourlyRate}/hr · {booking.hours}h
                                </span>
                            </div>

                            {/* Action — only Pending bookings can be cancelled */}
                            <div className="flex shrink-0 gap-2 sm:ml-2">
                                {booking.status === "Pending" && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setPendingCancel(booking)}
                                    >
                                        <X />
                                        Cancel Booking
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cancel confirmation */}
            <AlertDialog
                open={!!pendingCancel}
                onOpenChange={(open) => {
                    if (!open && !cancelling) {
                        setPendingCancel(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel this booking?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {pendingCancel
                                ? `Your reservation for "${pendingCancel.studioTitle}" on ${pendingCancel.date} at ${pendingCancel.startTime} will be cancelled. This action cannot be undone.`
                                : "This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={cancelling}>
                            Keep booking
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleCancel();
                            }}
                            disabled={cancelling}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {cancelling ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                "Cancel booking"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MyBookingsPage;
