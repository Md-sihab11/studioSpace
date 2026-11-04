"use client";

import React, { useEffect, useState } from "react";
import { Aperture, Star } from "lucide-react";
import { cn } from "cn";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

type StudioGalleryProps = {
    images: string[];
    title: string;
    category: string;
    rating?: number;
    reviewCount?: number;
};

/**
 * Image carousel for the studio details page. Uses plain <img> (not
 * next/image) because listing images come from arbitrary user URLs —
 * next/image would throw for hosts missing from next.config images.
 */
const StudioGallery = ({ images, title, category, rating, reviewCount }: StudioGalleryProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [failed, setFailed] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    const hasRating = typeof rating === "number" && rating > 0;

    if (images.length === 0) {
        return (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Aperture className="size-12" strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl bg-muted">
            <Carousel opts={{ loop: images.length > 1 }} setApi={setApi}>
                <CarouselContent>
                    {images.map((src, index) => (
                        <CarouselItem key={`${src}-${index}`}>
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                {failed[src] ? (
                                    <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <Aperture className="size-12" strokeWidth={1.5} />
                                    </span>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt={`${title} — photo ${index + 1}`}
                                        className="h-full w-full object-cover"
                                        onError={() =>
                                            setFailed((prev) => ({ ...prev, [src]: true }))
                                        }
                                    />
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {images.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4 bg-white/90 text-black hover:bg-white" />
                        <CarouselNext className="right-4 bg-white/90 text-black hover:bg-white" />
                    </>
                )}
            </Carousel>

            {/* Category + rating overlays */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
                <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {category}
                </span>
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md",
                        hasRating ? "bg-black/55 text-white" : "bg-[#B7F36B] text-black"
                    )}
                >
                    <Star
                        className={cn("size-3", hasRating && "fill-[#B7F36B] text-[#B7F36B]")}
                    />
                    {hasRating
                        ? `${rating!.toFixed(1)} (${reviewCount ?? 0})`
                        : "New"}
                </span>
            </div>

            {/* Slide dots */}
            {images.length > 1 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={cn(
                                "size-1.5 rounded-full bg-white transition-opacity",
                                index === current ? "opacity-100" : "opacity-40"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudioGallery;
