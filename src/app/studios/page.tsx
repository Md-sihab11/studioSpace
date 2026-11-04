"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Aperture,
    ArrowUpRight,
    MapPin,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Star,
    WifiOff,
    X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/constants";

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
};

/** Drops incomplete records so one bad row can't break the grid. */
const isRenderable = (studio: RemoteStudio): boolean =>
    Boolean(studio && studio._id && studio.title && Number.isFinite(studio.hourlyRate));

/**
 * Optimizes Unsplash images to reduce image size.
 */
const optimizeImageUrl = (url: string): string => {
    try {
        const parsed = new URL(url);

        if (
            parsed.hostname === "images.unsplash.com" &&
            !parsed.searchParams.has("w")
        ) {
            parsed.searchParams.set("auto", "format");
            parsed.searchParams.set("fit", "crop");
            parsed.searchParams.set("w", "1200");
            parsed.searchParams.set("q", "80");

            return parsed.toString();
        }
    } catch {
        // Relative or malformed URL — leave it unchanged.
    }

    return url;
};

/** New listings store image; older seed documents store imageUrl. */
const coverOf = (studio: RemoteStudio): string | undefined =>
    studio.image ?? studio.imageUrl;

/** Checks whether the image URL belongs to Unsplash. */
const isUnsplashUrl = (url: string | undefined): boolean => {
    try {
        return new URL(url ?? "").hostname === "images.unsplash.com";
    } catch {
        return false;
    }
};

/** Inner explore content that uses search params safely within Suspense. */
const StudiosContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "All";

    const [studios, setStudios] = useState<RemoteStudio[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    /**
     * Category is derived from the URL rather than mirrored in state, so
     * /studios?category=... is the single source of truth and refreshing
     * the page keeps the same filter.
     */
    const setCategory = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }

        const queryString = params.toString();
        router.replace(
            queryString ? `${pathname}?${queryString}` : pathname,
            { scroll: false }
        );
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
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

    /* Retry from the error state. */
    const retry = () => {
        setStatus("loading");
        setReloadKey((key) => key + 1);
    };

    /* Dynamically derive categories from fetched data */
    const ALL_CATEGORIES = useMemo(() => {
        const cats = new Set<string>();
        studios.forEach((s) => {
            if (s.category?.trim()) cats.add(s.category.trim());
        });
        return ["All", ...Array.from(cats)];
    }, [studios]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return studios.filter((studio) => {
            const matchesCategory =
                activeCategory === "All" ||
                (studio.category ?? "").toLowerCase() === activeCategory.toLowerCase();

            const matchesQuery =
                !q ||
                studio.title.toLowerCase().includes(q) ||
                (studio.location ?? "").toLowerCase().includes(q) ||
                (studio.category ?? "").toLowerCase().includes(q) ||
                (studio.amenities ?? []).some((item) =>
                    item.toLowerCase().includes(q)
                ) ||
                (studio.overview ?? "").toLowerCase().includes(q);

            return matchesCategory && matchesQuery;
        });
    }, [studios, query, activeCategory]);

    const clearFilters = () => {
        setQuery("");
        setCategory("All");
    };

    const hasActiveFilter = query.trim() !== "" || activeCategory !== "All";

    const countLabel =
        status === "loading"
            ? "Loading studios…"
            : status === "error"
              ? "Studios unavailable"
              : `Showing ${filtered.length} ${filtered.length === 1 ? "studio" : "studios"}`;

    return (
        <section className="mx-auto w-full max-w-[1600px] px-4 pt-10 pb-16 sm:px-6 lg:px-8 xl:px-10">
            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Explore All Studios
            </h1>

            <p className="mt-3 text-base text-muted-foreground">
                Find your perfect creative space.
            </p>

            {/* Search & Results Bar */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className="text-sm text-muted-foreground">
                    {countLabel}
                </p>

                <div className="relative w-full sm:w-96">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search studios..."
                        aria-label="Search studios"
                        className="h-9 px-9"
                    />

                    {query && (
                        <button
                            type="button"
                            aria-label="Clear search input"
                            onClick={() => setQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Pills */}
            {status !== "loading" && ALL_CATEGORIES.length > 1 && (
                <div
                    role="group"
                    aria-label="Filter studios by category"
                    className="mt-6 flex items-center gap-2 overflow-x-auto pb-1"
                >
                    <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
                    {ALL_CATEGORIES.map((cat) => {
                        const isActive =
                            activeCategory.toLowerCase() === cat.toLowerCase();

                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                aria-pressed={isActive}
                                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                                        : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Active filters summary */}
            {hasActiveFilter && status === "ready" && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <p>
                        {filtered.length === 0
                            ? "No matching studios"
                            : `${filtered.length} studio${filtered.length !== 1 ? "s" : ""} found`}
                        {activeCategory !== "All" && (
                            <> in <span className="font-semibold text-foreground">{activeCategory}</span></>
                        )}
                        {query.trim() && (
                            <> for &ldquo;<span className="font-semibold text-foreground">{query.trim()}</span>&rdquo;</>
                        )}
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                        <X className="size-3.5" />
                        Reset filters
                    </button>
                </div>
            )}

            {status === "loading" ? (
                /* Skeleton while the backend responds */
                <div
                    aria-hidden="true"
                    className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
                        >
                            <Skeleton className="aspect-[16/9] w-full rounded-none" />

                            <div className="flex flex-col gap-3.5 p-5">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="mt-auto h-9 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : status === "error" ? (
                /* Backend unreachable */
                <div className="mt-8">
                    <Empty className="border border-dashed py-16">
                        <EmptyHeader>
                            <EmptyMedia variant="icon" className="size-14 rounded-2xl">
                                <WifiOff className="size-7" strokeWidth={1.5} />
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
                            <Button type="button" variant="outline" onClick={retry}>
                                <RefreshCw className="size-4" />
                                Try again
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            ) : filtered.length > 0 ? (
                /* Studio grid */
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((studio) => {
                        const cover = coverOf(studio);

                        return (
                            <Card
                                key={studio._id}
                                className="group relative gap-0 p-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/5 hover:ring-foreground/20"
                            >
                                {/* Image */}
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                    {cover ? (
                                        isUnsplashUrl(cover) ? (
                                            <Image
                                                src={optimizeImageUrl(cover)}
                                                alt={studio.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={cover}
                                                alt={studio.title}
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        )
                                    ) : (
                                        <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                            <Aperture className="size-10" strokeWidth={1.5} />
                                        </span>
                                    )}

                                    {/* Rating pill */}
                                    <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                        <Star className="size-3 fill-[#B7F36B] text-[#B7F36B]" />

                                        {typeof studio.rating === "number" && studio.rating > 0
                                            ? studio.rating.toFixed(1)
                                            : "New"}

                                        {typeof studio.rating === "number" &&
                                            studio.rating > 0 && (
                                                <span className="font-normal text-white/70">
                                                    ({studio.reviews ?? 0})
                                                </span>
                                            )}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="flex flex-1 flex-col gap-3.5 p-5">
                                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="size-3.5 shrink-0" />
                                        {studio.location}
                                    </p>

                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="text-lg leading-snug font-semibold">
                                            {studio.title}
                                        </h2>

                                        <div className="shrink-0 text-right">
                                            <p className="text-lg leading-snug font-semibold">
                                                ${studio.hourlyRate}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                / hour
                                            </p>
                                        </div>
                                    </div>

                                    <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="secondary" className="truncate">
                                            {studio.category}
                                        </Badge>

                                        {typeof studio.maxCapacity === "number" &&
                                            studio.maxCapacity > 0 && (
                                                <span className="truncate">
                                                    Up to {studio.maxCapacity} people
                                                </span>
                                            )}
                                    </p>

                                    {/* Decorative CTA */}
                                    <span className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e63946] text-sm font-semibold text-white shadow-md shadow-[#e63946]/20 transition-all duration-300 hover:bg-[#ff4757] group-hover:bg-[#ff4757] group-hover:shadow-lg group-hover:shadow-[#e63946]/30">
                                        View Details

                                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                                    </span>
                                </div>

                                {/* Whole-card link */}
                                <Link
                                    href={`/studios/${studio._id}`}
                                    aria-label={`View ${studio.title}`}
                                    className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
                                />
                            </Card>
                        );
                    })}
                </div>
            ) : (
                /* No matches for the search and category filters */
                <div className="mt-8">
                    <Empty className="border border-dashed py-16">
                        <EmptyHeader>
                            <EmptyMedia variant="icon" className="size-14 rounded-2xl">
                                <Search className="size-7" strokeWidth={1.5} />
                            </EmptyMedia>

                            <EmptyTitle className="text-lg font-semibold">
                                No studios found
                            </EmptyTitle>

                            <EmptyDescription>
                                {query.trim()
                                    ? `Nothing matches "${query.trim()}"${activeCategory !== "All" ? ` in category ${activeCategory}` : ""}. Try another keyword or clear your filters.`
                                    : `No studios currently found in category "${activeCategory}".`}
                            </EmptyDescription>
                        </EmptyHeader>

                        <EmptyContent>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            )}
        </section>
    );
};

/**
 * /studios — Explore All Studios.
 * Wrapped in Suspense to safely allow useSearchParams reading on client side.
 */
const StudiosPage = () => {
    return (
        <Suspense
            fallback={
                <section className="mx-auto w-full max-w-[1600px] px-4 pt-10 pb-16 sm:px-6 lg:px-8 xl:px-10">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="mt-3 h-5 w-48" />
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-80 w-full rounded-xl" />
                        ))}
                    </div>
                </section>
            }
        >
            <StudiosContent />
        </Suspense>
    );
};

export default StudiosPage;
