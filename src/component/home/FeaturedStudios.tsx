"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Aperture, Clock, MapPin, Search, SlidersHorizontal, Star, Verified, X, RefreshCw } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Top-rated listings only. The backend sorts by rating/createdAt and applies
 * `.limit(6)`; the client keeps a slice as a safety net.
 */
const STUDIOS_API = `${API_BASE_URL}/studios?limit=${6}&sort=rating`;

/** The home page only surfaces the top six listings — /studios holds the rest. */
const MAX_FEATURED_STUDIOS = 6;

/** Document shape returned by GET /studios. */
type RemoteStudio = {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    maxCapacity?: number;
    location?: string;
    image?: string;
    imageUrl?: string;
    rating?: number;
    reviews?: number;
    amenities?: string[];
    overview?: string;
    createdAt?: string;
};

/** Drops incomplete records (e.g. empty docs) so one bad row can't break the grid. */
const isRenderable = (studio: RemoteStudio): boolean =>
    Boolean(studio && studio._id && studio.title && Number.isFinite(studio.hourlyRate));

const optimizeImageUrl = (url: string): string => {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === "images.unsplash.com" && !parsed.searchParams.has("w")) {
            parsed.searchParams.set("auto", "format");
            parsed.searchParams.set("fit", "crop");
            parsed.searchParams.set("w", "1200");
            parsed.searchParams.set("q", "80");
            return parsed.toString();
        }
    } catch {
        // Relative or malformed URL — leave it for next/image to validate.
    }
    return url;
};

/** New listings store `image`; older seed documents store `imageUrl`. */
const coverOf = (studio: RemoteStudio): string | undefined =>
    studio.image ?? studio.imageUrl;

/** next/image only accepts hosts whitelisted in next.config — use  elsewhere. */
const isUnsplashUrl = (url: string | undefined): boolean => {
    try {
        return new URL(url ?? "").hostname === "images.unsplash.com";
    } catch {
        return false;
    }
};

/** Map backend studio fields to the card's local shape. */
const toCardStudio = (studio: RemoteStudio) => ({
    id: studio._id,
    name: studio.title,
    category: studio.category,
    location: studio.location ?? "Location not set",
    image: coverOf(studio) ?? "",
    pricePerHour: studio.hourlyRate,
    rating: studio.rating ?? 0,
    reviews: studio.reviews ?? 0,
    features: studio.amenities ?? [],
    createdAt: studio.createdAt ?? "",
});

const FeaturedStudios = () => {
    const [studios, setStudios] = useState<RemoteStudio[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    /* Bumped by the retry button to re-run the fetch effect. */
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch(STUDIOS_API, {
                    signal: AbortSignal.timeout(60_000),
                });
                if (!res.ok) {
                    throw new Error(`The studios API responded with ${res.status}`);
                }
                const data: unknown = await res.json();
                if (!Array.isArray(data)) {
                    throw new Error("The studios API returned an unexpected payload");
                }
                if (!cancelled) {
                    setStudios((data as RemoteStudio[]).filter(isRenderable));
                    setStatus("ready");
                }
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
    }, [reloadKey]);

    /* Retry from the error state — event handlers may set state synchronously. */
    const retry = () => {
        setStatus("loading");
        setReloadKey((key) => key + 1);
    };

    /* Derive categories from fetched data. */
    const ALL_CATEGORIES = useMemo(() => {
        const cats = new Set<string>(studios.map((s) => s.category).filter(Boolean));
        return ["All", ...Array.from(cats)];
    }, [studios]);

    const cardStudios = useMemo(
        () => studios.map(toCardStudio),
        [studios]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return cardStudios.filter((studio) => {
            const matchesCategory =
                activeCategory === "All" || studio.category === activeCategory;
            const matchesQuery =
                !q ||
                studio.name.toLowerCase().includes(q) ||
                studio.location.toLowerCase().includes(q) ||
                studio.category.toLowerCase().includes(q) ||
                studio.features.some((f) => f.toLowerCase().includes(q));
            return matchesCategory && matchesQuery;
        })
            .sort(
                (a, b) =>
                    b.rating - a.rating ||
                    b.createdAt.localeCompare(a.createdAt)
            )
            .slice(0, MAX_FEATURED_STUDIOS);
    }, [cardStudios, query, activeCategory]);

    const clearSearch = () => {
        setQuery("");
        setActiveCategory("All");
    };

    const hasActiveFilter = query.trim() !== "" || activeCategory !== "All";

    return (
        <section id="featured" className="scroll-mt-24 bg-gray-50 py-16 dark:bg-[#0a0a0a] sm:py-20 lg:py-24">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
                {/* Section header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                            Handpicked for you
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                            Featured Studios
                        </h2>
                        <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                            Top-rated spaces loved by photographers, filmmakers and musicians
                            this month — every listing verified by our team.
                        </p>
                    </div>
                    <Link
                        href="/studios"
                        className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800 dark:text-sky-400 dark:hover:text-sky-300"
                    >
                        Browse all studios
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Search & Filter Bar */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                            id="studio-search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, location or feature…"
                            aria-label="Search studios"
                            className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-white/10 dark:bg-[#131313] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-sky-400 dark:focus:ring-sky-400/20"
                        />
                        {query && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Category pills */}
                    <div
                        role="group"
                        aria-label="Filter by category"
                        className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
                    >
                        <SlidersHorizontal className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />
                        {ALL_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={activeCategory === cat}
                                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                    activeCategory === cat
                                        ? "bg-teal-600 text-white shadow-sm shadow-teal-600/30 dark:bg-sky-500 dark:shadow-sky-500/30"
                                        : "border border-gray-200 bg-white text-gray-600 hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-[#131313] dark:text-gray-400 dark:hover:border-sky-400 dark:hover:text-sky-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                {hasActiveFilter && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {filtered.length === 0
                            ? "No studios found"
                            : `${filtered.length} studio${filtered.length !== 1 ? "s" : ""} found`}
                        {query.trim() && (
                            <> for &ldquo;<span className="font-medium text-gray-700 dark:text-gray-200">{query.trim()}</span>&rdquo;</>
                        )}
                    </p>
                )}

                {/* Studio grid or empty or loading or error */}
                {status === "loading" ? (
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#131313]"
                            >
                                <div className="h-56 bg-gray-200 dark:bg-[#1a1a1a]">
                                    <Skeleton className="h-full w-full" />
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                    <Skeleton className="h-3 w-full mb-4" />
                                    <Skeleton className="h-3 w-2/3 mb-2" />
                                    <Skeleton className="h-3 w-1/3 mb-6" />
                                    <Skeleton className="h-9 w-full mt-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : status === "error" ? (
                    <div className="mt-10">
                        <Empty className="border border-dashed py-16">
                            <EmptyHeader>
                                <EmptyMedia variant="icon" className="size-14 rounded-2xl">
                                    <RefreshCw className="size-7" strokeWidth={1.5} />
                                </EmptyMedia>
                                <EmptyTitle className="text-lg font-semibold">
                                    Couldn&apos;t load studios
                                </EmptyTitle>
                                <EmptyDescription>
                                    {error}. Free Render services sleep when idle, so the first
                                    request can take up to a minute.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <button
                                    type="button"
                                    onClick={retry}
                                    className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] dark:bg-sky-500 dark:shadow-sky-500/25 dark:hover:bg-sky-600"
                                >
                                    <RefreshCw className="size-4" />
                                    Try again
                                </button>
                            </EmptyContent>
                        </Empty>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="relative mt-10">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-6 py-4">
                                {filtered.map((studio) => (
                                    <CarouselItem
                                        key={studio.id}
                                        className="basis-full pl-6 sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <div className="h-full">
                                            <Link
                                                href={`/studios/${studio.id}`}
                                                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-300 hover:shadow-2xl hover:shadow-black/5 dark:border-white/10 dark:bg-[#131313] dark:hover:border-sky-500/40"
                                            >
                                                {/* Image */}
                                                <div className="relative h-56 w-full shrink-0 overflow-hidden">
                                                    {studio.image ? (
                                                        isUnsplashUrl(studio.image) ? (
                                                            <Image
                                                                src={optimizeImageUrl(studio.image)}
                                                                alt={studio.name}
                                                                fill
                                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={studio.image}
                                                                alt={studio.name}
                                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                            />
                                                        )
                                                    ) : (
                                                        <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                            <Aperture className="size-10" strokeWidth={1.5} />
                                                        </span>
                                                    )}
                                                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                                                        <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                                            {studio.category}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#B7F36B] px-2.5 py-1 text-xs font-bold text-black">
                                                            <Verified className="size-3" />
                                                            Verified
                                                        </span>
                                                    </div>
                                                    <div className="absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                                        <Star className="size-3 fill-[#B7F36B] text-[#B7F36B]" />
                                                        {studio.rating.toFixed(1)}
                                                        <span className="font-normal text-white/70">
                                                            ({studio.reviews})
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="flex flex-1 flex-col justify-between p-5">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-sky-300">
                                                            {studio.name}
                                                        </h3>
                                                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                            <MapPin className="size-3.5 shrink-0" />
                                                            {studio.location}
                                                        </p>

                                                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                                                            {studio.features.map((feature) => (
                                                                <span
                                                                    key={feature}
                                                                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300"
                                                                >
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mt-5">
                                                        <div className="mb-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    ${studio.pricePerHour}
                                                                </span>
                                                                /hour
                                                            </p>
                                                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-sky-400">
                                                                <Clock className="size-3.5" />
                                                                Available today
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="inline-flex w-full items-center justify-center rounded-full bg-[#e63946] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-all duration-200 group-hover:bg-[#ff4757] group-hover:shadow-xl group-hover:shadow-[#e63946]/40 active:scale-[0.98]"
                                                        >
                                                            View Details
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-3 sm:-left-5 lg:-left-6 z-20 size-10 rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 disabled:opacity-30 dark:border-white/10 dark:bg-[#131313]/95 dark:text-white dark:hover:bg-[#1f1f1f]" />
                            <CarouselNext className="-right-3 sm:-right-5 lg:-right-6 z-20 size-10 rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 disabled:opacity-30 dark:border-white/10 dark:bg-[#131313]/95 dark:text-white dark:hover:bg-[#1f1f1f]" />
                        </Carousel>
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <div className="mt-10">
                        <Empty className="border border-dashed border-gray-200 bg-white py-20 dark:border-white/10 dark:bg-[#131313]">
                            <EmptyHeader>
                                <EmptyMedia>
                                    <span className="flex size-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-500 dark:bg-sky-500/10 dark:text-sky-400">
                                        <Search className="size-9" strokeWidth={1.5} />
                                    </span>
                                </EmptyMedia>
                                <EmptyTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                    No studios found
                                </EmptyTitle>
                                <EmptyDescription>
                                    {query.trim()
                                        ? <>We couldn&apos;t find any studios matching &ldquo;<strong className="font-semibold text-gray-700 dark:text-gray-200">{query.trim()}</strong>&rdquo;{activeCategory !== "All" ? ` in ${activeCategory}` : ""}. Try a different keyword or clear your filters.</>
                                        : <>No studios available in the <strong className="font-semibold text-gray-700 dark:text-gray-200">{activeCategory}</strong> category right now. Check back soon or explore other categories.</>
                                    }
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <button
                                    id="clear-studio-search"
                                    type="button"
                                    onClick={clearSearch}
                                    className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] dark:bg-sky-500 dark:shadow-sky-500/25 dark:hover:bg-sky-600"
                                >
                                    <X className="size-4" />
                                    Clear filters
                                </button>
                                <Link
                                    href="/#categories"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                                >
                                    Browse all categories
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </EmptyContent>
                        </Empty>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedStudios;
