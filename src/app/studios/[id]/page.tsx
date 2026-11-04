"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarClock,
    Check,
    MapPin,
    RefreshCw,
    ShieldCheck,
    Star,
    Tag,
    User,
    Users,
    Wallet,
    WifiOff,
} from "lucide-react";
import { cn } from "cn";
import StudioGallery from "@/component/studio-detail/StudioGallery";
import BookingModal from "@/component/studio-detail/BookingModal";
import { API_BASE_URL } from "@/lib/constants";
import { SAMPLE_REVIEWS } from "@/lib/sample-reviews";
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

/** Document shape returned by the studios API. */
type RemoteStudio = {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit?: number;
    maxCapacity?: number;
    location?: string;
    image?: string;
    imageUrl?: string;
    images?: string[];
    amenities?: string[];
    overview?: string;
    ownerEmail?: string;
    ownerName?: string;
    rating?: number;
    reviews?: number;
};

type Status = "loading" | "ready" | "error" | "not-found";

const StarRow = ({ rating }: { rating: number }) => (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((step) => (
            <Star
                key={step}
                className={cn(
                    "size-4",
                    step <= Math.round(rating)
                        ? "fill-[#B7F36B] text-[#B7F36B]"
                        : "text-muted-foreground/40"
                )}
            />
        ))}
    </span>
);

/**
 * /studios/[id] — workspace details.
 *
 * Client-side fetch (like /studios) so the route never blocks on the
 * Render cold start; renders its own loading / error / 404 states.
 * `params` is a Promise in Next 16 — unwrapped with React's use().
 */
const StudioDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    const [studio, setStudio] = useState<RemoteStudio | null>(null);
    const [status, setStatus] = useState<Status>("loading");
    const [error, setError] = useState("");
    /* Bumped by the retry button to re-run the fetch effect. */
    const [reloadKey, setReloadKey] = useState(0);
    const [bookingOpen, setBookingOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        (async () => {
            try {
                let found: RemoteStudio | null = null;

                // Primary: single-document endpoint.
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/studios/${encodeURIComponent(id)}`,
                        { signal: AbortSignal.timeout(60_000) }
                    );

                    if (res.ok) {
                        const data: unknown = await res.json();
                        

                        if (data && typeof data === "object" && "_id" in data) {
                            found = data as RemoteStudio;
                        }
                    }
                } catch {
                    // Endpoint missing or backend asleep — fall back to the list.
                }

                // Fallback: find the document in the full list.
                if (!found) {
                    const res = await fetch(
                        `${API_BASE_URL}/studios`,
                        {
                            signal: AbortSignal.timeout(60_000),
                        }
                    );

                    if (!res.ok) {
                        throw new Error(`The studios API responded with ${res.status}`);
                    }

                    const data: unknown = await res.json();
                    

                    if (!Array.isArray(data)) {
                        throw new Error("The studios API returned an unexpected payload");
                    }

                    found =
                        (data as RemoteStudio[]).find(
                            (item) => item && item._id === id
                        ) ?? null;
                }

                if (cancelled) return;

                if (!found) {
                    setStatus("not-found");
                    return;
                }

                setStudio(found);
                setStatus("ready");
            } catch (cause) {
                if (cancelled) return;

                if (cause instanceof Error && cause.name === "TimeoutError") {
                    setError("The backend did not respond within 60 seconds");
                } else if (cause instanceof Error && cause.message) {
                    setError(cause.message);
                } else {
                    setError("Could not reach the studios API");
                }

                setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const retry = () => {
        setStatus("loading");
        setReloadKey((key) => key + 1);
    };

    /* images[] when present, else the legacy single image/imageUrl field. */
    const galleryImages = useMemo(() => {
        if (!studio) return [];

        if (Array.isArray(studio.images) && studio.images.length > 0) {
            return studio.images.filter((src): src is string => Boolean(src));
        }

        const single = studio.image ?? studio.imageUrl;
        return single ? [single] : [];
    }, [studio]);

    /* Stored rating when available, otherwise the sample-review average. */
    const summaryRating = useMemo(() => {
        if (studio && typeof studio.rating === "number" && studio.rating > 0) {
            return studio.rating;
        }

        const total = SAMPLE_REVIEWS.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((total / SAMPLE_REVIEWS.length) * 10) / 10;
    }, [studio]);

    const reviewCount = useMemo(() => {
        if (studio && typeof studio.reviews === "number" && studio.reviews > 0) {
            return studio.reviews;
        }

        return SAMPLE_REVIEWS.length;
    }, [studio]);

    /* ── Loading ── */
    if (status === "loading") {
        return (
            <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-10">
                <Skeleton className="h-5 w-36" />

                <div className="mt-6 grid gap-8 lg:grid-cols-3">
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                        <Skeleton className="h-9 w-2/3" />
                        <Skeleton className="h-5 w-1/2" />

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton key={index} className="h-24 w-full rounded-2xl" />
                            ))}
                        </div>

                        <Skeleton className="h-44 w-full rounded-2xl" />
                    </div>

                    <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
            </section>
        );
    }

    /* ── Backend unreachable ── */
    if (status === "error") {
        return (
            <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-10">
                <Empty className="border border-dashed py-16">
                    <EmptyHeader>
                        <EmptyMedia variant="icon" className="size-14 rounded-2xl">
                            <WifiOff className="size-7" strokeWidth={1.5} />
                        </EmptyMedia>

                        <EmptyTitle className="text-lg font-semibold">
                            Couldn&apos;t load this studio
                        </EmptyTitle>

                        <EmptyDescription>
                            {error}. Free Render services sleep when idle, so the first request
                            can take up to a minute.
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent>
                        <Button type="button" variant="outline" onClick={retry}>
                            <RefreshCw className="size-4" />
                            Try again
                        </Button>

                        <Link
                            href="/studios"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                        >
                            <ArrowLeft className="size-3.5" />
                            Back to studios
                        </Link>
                    </EmptyContent>
                </Empty>
            </section>
        );
    }

    /* ── Not found ── */
    if (status === "not-found" || !studio) {
        return (
            <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-10">
                <Empty className="border border-dashed py-16">
                    <EmptyHeader>
                        <EmptyMedia variant="icon" className="size-14 rounded-2xl">
                            <Tag className="size-7" strokeWidth={1.5} />
                        </EmptyMedia>

                        <EmptyTitle className="text-lg font-semibold">
                            Studio not found
                        </EmptyTitle>

                        <EmptyDescription>
                            This listing doesn&apos;t exist or is no longer available.
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent>
                        <Link
                            href="/studios"
                            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold transition-all hover:bg-primary/90"
                        >
                            <ArrowLeft className="size-4" />
                            Browse all studios
                        </Link>
                    </EmptyContent>
                </Empty>
            </section>
        );
    }

    const hostName = studio.ownerName?.trim() || "StudioSpace Host";

    const hostInitials = hostName
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const amenities = studio.amenities ?? [];

    const specs = [
        {
            icon: Wallet,
            label: "Hourly Rate",
            value: `$${studio.hourlyRate}/hr`,
        },
        {
            icon: ShieldCheck,
            label: "Security Deposit",
            value: `$${studio.securityDeposit ?? 0}`,
        },
        {
            icon: Users,
            label: "Max Capacity",
            value: studio.maxCapacity ? `Up to ${studio.maxCapacity}` : "—",
        },
        {
            icon: Tag,
            label: "Category",
            value: studio.category,
        },
    ];

    /* ── Ready ── */
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-10">
            {/* Back link */}
            <Link
                href="/studios"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
            >
                <ArrowLeft className="size-4" />
                Back to studios
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-3">
                {/* ── Main column ── */}
                <div className="flex flex-col gap-8 lg:col-span-2">
                    {/* Gallery */}
                    <StudioGallery
                        images={galleryImages}
                        title={studio.title}
                        category={studio.category}
                        rating={studio.rating}
                        reviewCount={studio.reviews}
                    />

                    {/* Title block */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {studio.title}
                            </h1>

                            <Badge variant="secondary">{studio.category}</Badge>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-4 shrink-0" />
                                {studio.location || "Location not specified"}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Star className="size-4 shrink-0 fill-[#B7F36B] text-[#B7F36B]" />

                                <strong className="font-semibold text-gray-900 dark:text-white">
                                    {summaryRating.toFixed(1)}
                                </strong>

                                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                            </span>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {specs.map((spec) => (
                            <div
                                key={spec.label}
                                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#131313]"
                            >
                                <spec.icon
                                    className="size-4 text-teal-600 dark:text-sky-400"
                                    strokeWidth={1.75}
                                />

                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {spec.label}
                                </p>

                                <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
                                    {spec.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Overview */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#131313]">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Detailed Overview
                        </h2>

                        <p className="mt-3 text-sm leading-7 whitespace-pre-line text-gray-600 dark:text-gray-300">
                            {studio.overview?.trim() ||
                                "The host hasn't added a description for this space yet."}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#131313]">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Amenities
                        </h2>

                        {amenities.length > 0 ? (
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
                                {amenities.map((amenity) => (
                                    <span
                                        key={amenity}
                                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-sky-500/10 dark:text-sky-400">
                                            <Check className="size-3" strokeWidth={2.5} />
                                        </span>

                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                No amenities listed for this space.
                            </p>
                        )}
                    </div>

                    {/* Host details */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#131313]">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Hosted by
                        </h2>

                        <div className="mt-4 flex items-center gap-4">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                                {hostInitials || <User className="size-5" />}
                            </span>

                            <div className="min-w-0">
                                <p className="flex items-center gap-1.5 truncate font-semibold text-gray-900 dark:text-white">
                                    {hostName}

                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#B7F36B] px-2 py-0.5 text-[11px] font-bold text-black">
                                        <ShieldCheck className="size-3" />
                                        Verified host
                                    </span>
                                </p>

                                {studio.ownerEmail && (
                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                        {studio.ownerEmail}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#131313]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Reviews
                            </h2>

                            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Star className="size-4 fill-[#B7F36B] text-[#B7F36B]" />

                                <strong className="font-semibold text-gray-900 dark:text-white">
                                    {summaryRating.toFixed(1)}
                                </strong>

                                · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                            </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {SAMPLE_REVIEWS.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/[0.03]"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                                                {review.name
                                                    .split(/\s+/)
                                                    .map((part) => part[0])
                                                    .slice(0, 2)
                                                    .join("")
                                                    .toUpperCase()}
                                            </span>

                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {review.name}
                                                </p>

                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {review.date}
                                                </p>
                                            </div>
                                        </div>

                                        <StarRow rating={review.rating} />
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                        {review.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 dark:border-white/10 dark:bg-[#131313]">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${studio.hourlyRate}
                            </span>

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                / hour
                            </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            ${studio.securityDeposit ?? 0} refundable deposit
                        </p>

                        <dl className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm dark:border-white/10">
                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <Users className="size-4" />
                                    Capacity
                                </dt>

                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {studio.maxCapacity
                                        ? `Up to ${studio.maxCapacity} guests`
                                        : "—"}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <MapPin className="size-4" />
                                    Location
                                </dt>

                                <dd className="truncate font-medium text-gray-900 dark:text-white">
                                    {studio.location || "—"}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <CalendarClock className="size-4" />
                                    Availability
                                </dt>

                                <dd className="font-medium text-gray-900 dark:text-white">
                                    By the hour
                                </dd>
                            </div>
                        </dl>

                        <button
                            type="button"
                            onClick={() => setBookingOpen(true)}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-bold shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
                        >
                            Book Workspace Now
                        </button>

                        <p className="mt-4 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                            Bookings are saved as <strong>Pending</strong> and can be cancelled
                            from My Bookings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Booking modal */}
            <BookingModal
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                studio={{
                    _id: studio._id,
                    title: studio.title,
                    image: galleryImages[0],
                    location: studio.location,
                    hourlyRate: studio.hourlyRate,
                }}
            />
        </section>
    );
};

export default StudioDetailsPage;
