import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Star, Verified } from "lucide-react";

type Studio = {
    id: string;
    name: string;
    category: string;
    location: string;
    image: string;
    pricePerHour: number;
    rating: number;
    reviews: number;
    features: string[];
};

/**
 * Presentation content for the homepage. When the studios API is wired up,
 * swap this array for a fetch — the card markup stays the same.
 */
const FEATURED_STUDIOS: Studio[] = [
    {
        id: "loft-photo-studio",
        name: "Loft Photo Studio",
        category: "Photography",
        location: "Arts District, Los Angeles",
        image: "/studio/image1.png",
        pricePerHour: 45,
        rating: 4.9,
        reviews: 128,
        features: ["Softboxes", "Makeup area", "Wi-Fi"],
    },
    {
        id: "neon-sound-stage",
        name: "Neon Sound Stage",
        category: "Film & Video",
        location: "Studio City, CA",
        image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1080&q=80",
        pricePerHour: 65,
        rating: 4.8,
        reviews: 96,
        features: ["4K camera", "Lighting grid", "Cyc wall"],
    },
    {
        id: "midnight-recording-suite",
        name: "Midnight Recording Suite",
        category: "Music",
        location: "East Nashville, TN",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1080&q=80",
        pricePerHour: 55,
        rating: 5.0,
        reviews: 74,
        features: ["Analog console", "Iso booth", "Engineer on call"],
    },
    {
        id: "sunlit-home-studio",
        name: "Sunlit Home Studio",
        category: "Music",
        location: "Brooklyn, NY",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1080&q=80",
        pricePerHour: 35,
        rating: 4.7,
        reviews: 61,
        features: ["Grand piano", "Backline", "Natural light"],
    },
    {
        id: "the-podcast-loft",
        name: "The Podcast Loft",
        category: "Podcast",
        location: "Wicker Park, Chicago",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1080&q=80",
        pricePerHour: 30,
        rating: 4.9,
        reviews: 152,
        features: ["4-mic setup", "Acoustic treated", "4K cameras"],
    },
    {
        id: "canvas-art-workshop",
        name: "Canvas Art Workshop",
        category: "Art",
        location: "Capitol Hill, Seattle",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1080&q=80",
        pricePerHour: 25,
        rating: 4.8,
        reviews: 43,
        features: ["Easels", "Sink & cleanup", "Dry space"],
    },
];

const FeaturedStudios = () => {
    return (
        <section id="featured" className="scroll-mt-24 bg-gray-50 py-16 dark:bg-[#0a0a0a] sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
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
                        href="/#categories"
                        className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800 dark:text-sky-400 dark:hover:text-sky-300"
                    >
                        Browse all studios
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Studio grid */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURED_STUDIOS.map((studio) => (
                        <Link
                            key={studio.id}
                            href={`/studios/${studio.id}`}
                            className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-300 hover:shadow-2xl hover:shadow-black/5 dark:border-white/10 dark:bg-[#131313] dark:hover:border-sky-500/40"
                        >
                            {/* Image */}
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={studio.image}
                                    alt={studio.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
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
                            <div className="flex flex-1 flex-col p-5">
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

                                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
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
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedStudios;
