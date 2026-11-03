"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Aperture,
    ArrowUpRight,
    MapPin,
    RefreshCw,
    Search,
    Star,
    WifiOff,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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

/** Where the StudioSpace backend serves the studio list from. */
const STUDIOS_API = "https://studiospace-backend-oqeo.onrender.com/studios";

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

/** Drops incomplete records (e.g. empty docs) so one bad row can't break the grid. */
const isRenderable = (studio: RemoteStudio): boolean =>
    Boolean(studio && studio._id && studio.title && Number.isFinite(studio.hourlyRate));

/**
 * Bare Unsplash photo URLs serve the multi-megabyte original, and `/_next/image`
 * must download it within a hard 7s upstream timeout — a grid of them times out.
 * Appending sizing params keeps each fetch ~100KB instead of ~6MB. URLs that
 * already carry a `w` param (or aren't absolute) are passed through unchanged.
 */
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

/** next/image only accepts hosts whitelisted in next.config — use <img> elsewhere. */
const isUnsplashUrl = (url: string | undefined): boolean => {
    try {
        return new URL(url ?? "").hostname === "images.unsplash.com";
    } catch {
        return false;
    }
};

/**
 * /studios — "Explore All Studios".
 *
 * Every card renders data fetched from the backend (GET /studios); there is no
 * static fallback. The fetch runs client-side so the route never blocks on the
 * Render cold start during render, and a failed load shows a retry state.
 */
const StudiosPage = () => {
    const [studios, setStudios] = useState<RemoteStudio[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    /* Bumped by the retry button to re-run the fetch effect. */
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        // Async IIFE — state is only touched after the fetch settles, so the
        // effect body itself never calls setState synchronously.
        (async () => {
            try {
                const res = await fetch(STUDIOS_API, {
                    signal: AbortSignal.timeout(60_000),
                });
                if (!res.ok) {
                    throw new Error(`The studios API responded with ${res.status}`);
                }
                const data: unknown = await res.json();
                console.log("API working", data);
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

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return studios;

        return studios.filter(
            (studio) =>
                studio.title.toLowerCase().includes(q) ||
                (studio.location ?? "").toLowerCase().includes(q) ||
                (studio.category ?? "").toLowerCase().includes(q) ||
                (studio.amenities ?? []).some((item) => item.toLowerCase().includes(q)) ||
                (studio.overview ?? "").toLowerCase().includes(q)
        );
    }, [studios, query]);

    const countLabel =
        status === "loading"
            ? "Loading studios…"
            : status === "error"
                ? "Studios unavailable"
                : `Showing ${filtered.length} ${filtered.length === 1 ? "studio" : "studios"}`;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-10">
            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Explore All Studios
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
                Find your perfect creative space.
            </p>

            {/* Result count + search */}
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
                </div>
            </div>

            {status === "loading" ? (
                /* Skeleton while the backend responds (Render sleeps when idle) */
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
                /* Studio grid — rendered only from the fetched data */
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((studio) => {
                        const cover = coverOf(studio);
                        return (
                            <Card
                                key={studio._id}
                                className="group relative gap-0 p-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/5 hover:ring-foreground/20"
                            >
                                {/* Image — unsplash URLs go through next/image (with the
                                size optimizer above); any other host uses a plain <img>
                                because next/image throws for unconfigured hosts. */}
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

                                    {/* Rating pill — listings with no rating show "New" */}
                                    <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                        <Star className="size-3 fill-[#B7F36B] text-[#B7F36B]" />
                                        {typeof studio.rating === "number" && studio.rating > 0
                                            ? studio.rating.toFixed(1)
                                            : "New"}
                                        {typeof studio.rating === "number" && studio.rating > 0 && (
                                            <span className="font-normal text-white/70">
                                                ({studio.reviews ?? 0})
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {/* Body: location → title + price → category + capacity → CTA */}
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

                                    {/* Decorative CTA — the stretched link below handles navigation */}
                                    <span
                                        className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e63946] text-sm font-semibold text-white shadow-md shadow-[#e63946]/20 transition-all duration-300 hover:bg-[#ff4757] group-hover:bg-[#ff4757] group-hover:shadow-lg group-hover:shadow-[#e63946]/30"
                                    >
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
                /* No matches for the search */
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
                                Nothing matches &ldquo;{query.trim()}&rdquo;. Try another
                                name, location or feature.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setQuery("")}
                            >
                                Clear search
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            )}
        </section>
    );
};

export default StudiosPage;
