import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowUpRight,
    Camera,
    Drum,
    Mic,
    Palette,
    Presentation,
    Projector,
    Shapes,
} from "lucide-react";

type Category = {
    name: string;
    /** Exact value stored in MongoDB's `studios.category` field. */
    value: string;
    description: string;
    studios: number;
    image: string;
    icon: React.ComponentType<{ className?: string }>;
};

const CATEGORIES: Category[] = [
    {
        name: "Photo Studios",
        value: "Photo Studio",
        description: "Cycloramas & daylight lofts",
        studios: 480,
        image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80",
        icon: Camera,
    },
    {
        name: "Sound Stages",
        value: "Film Stage",
        description: "Stages, sets & edit bays",
        studios: 310,
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
        icon: Projector,
    },
    {
        name: "Podcast Rooms",
        value: "Podcast Lounge",
        description: "Acoustically treated booths",
        studios: 260,
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
        icon: Mic,
    },
    {
        name: "Music Suites",
        value: "Music Suite",
        description: "Tracking & rehearsal rooms",
        studios: 395,
        image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80",
        icon: Drum,
    },
    {
        name: "Art Workshops",
        value: "Art Studio",
        description: "Paint, print & ceramics",
        studios: 175,
        image: "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=800&q=80",
        icon: Palette,
    },
    {
        name: "Creative Workshops",
        value: "Workshop",
        description: "Training & collaboration hubs",
        studios: 240,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        icon: Presentation,
    },
    {
        name: "Rehearsal Spaces",
        value: "Rehearsal Space",
        description: "Dance & performance rooms",
        studios: 210,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
        icon: Shapes,
    },
];

const Categories = () => {
    return (
        <section
            id="categories"
            className="scroll-mt-24 bg-white py-16 dark:bg-[#0d0d0d] sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">

                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                        Explore by craft
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                        Browse by Studio Categories
                    </h2>

                    <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                        Whatever you make, there is a space built for it. Start with a
                        category and narrow down by city, gear and budget.
                    </p>
                </div>

                {/* Expandable Category Carousel */}
                <div className="mt-12 flex h-[420px] w-full gap-2 sm:h-[500px] sm:gap-3">

                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.name}
                                href={`/studios?category=${encodeURIComponent(category.value)}`}
                                aria-label={`Browse ${category.name}`}
                                className="group relative min-w-0 flex-[1] cursor-pointer overflow-hidden rounded-2xl shadow-md transition-[flex] duration-500 ease-in-out hover:flex-[3] sm:rounded-3xl sm:hover:flex-[2.5]"
                            >
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 640px) 40vw, 25vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 transition-all duration-500 group-hover:from-black/95" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end p-2 text-center text-white transition-all duration-500 group-hover:items-start group-hover:p-4 sm:p-4 sm:group-hover:p-6">

                                    {/* Icon */}
                                    <div className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-md transition-all duration-500 group-hover:scale-110 sm:size-12">
                                        <Icon className="size-5 text-white sm:size-6" />
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="w-full text-xs font-bold leading-tight sm:text-base lg:text-lg">
                                        {category.name}
                                    </h3>

                                    {/* Additional Information */}
                                    <div className="invisible mt-3 w-full translate-y-8 opacity-0 transition-all duration-500 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150">

                                        <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
                                            {category.description}
                                        </p>

                                        <p className="mt-2 text-xs font-semibold text-[#B7F36B] sm:text-sm">
                                            {category.studios} Studios Available
                                        </p>

                                        <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                                            <span className="text-xs font-medium text-white sm:text-sm">
                                                Explore Category
                                            </span>

                                            <span className="flex size-8 items-center justify-center rounded-full bg-[#B7F36B] text-black transition-transform duration-300 group-hover:rotate-45">
                                                <ArrowUpRight className="size-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};

export default Categories;