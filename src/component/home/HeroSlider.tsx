"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { ArrowDown } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";

type HeroSlide = {
    /** Hollow, outlined headline word. */
    outline: string;
    /** Solid, bold headline word. */
    solid: string;
    description: string;
    image: string;
};

const SLIDES: HeroSlide[] = [
    {
        outline: "Photography",
        solid: "Studio",
        description:
            "Book beautifully equipped photo studios by the hour — verified spaces, instant confirmation, zero hassle.",
        image: "/studio/image1.png",
    },
    {
        outline: "Film",
        solid: "Studio",
        description:
            "From cycloramas to neon-lit stages, find spaces built for the shot you have in your head — lighting rigs included.",
        image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1920&q=80",
    },
    {
        outline: "Recording",
        solid: "Studio",
        description:
            "Isolated vocal booths, analog consoles and engineered control rooms, ready when inspiration strikes — day or night.",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=80",
    },
    {
        outline: "Music",
        solid: "Rehearsal",
        description:
            "Fully equipped rehearsal spaces with instruments, amplifiers and acoustic treatment, built for bands and musicians to create together.",
        image:
            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1920&q=80",
    },
    {
        outline: "Dance",
        solid: "Studio",
        description:
            "Spacious dance floors, mirrored walls and professional sound systems, perfect for choreography, dance classes and movement rehearsals.",
        image:
            "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1920&q=80",
    },
    {
        outline: "Art",
        solid: "Studio",
        description:
            "Inspiring creative spaces with natural lighting, flexible workstations and room for painters, designers and visual artists to create.",
        image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1920&q=80",
    },
];

function LinkedinIcon({ className }: SocialIconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.5 9h3.8v11H4.5zM6.4 3.5a2.2 2.2 0 110 4.4 2.2 2.2 0 010-4.4zM10.5 9h3.6v1.5c.5-.9 1.8-1.8 3.6-1.8 3.8 0 4.5 2.4 4.5 5.6V20h-3.8v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-3.8z" />
        </svg>
    );
}

const SOCIAL_LINKS = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mdsihab-sharar/", icon: LinkedinIcon },
    { label: "Instagram", href: "https://www.instagram.com/mdshihabmuzumder/", icon: InstagramIcon },
    { label: "Facebook", href: "#", icon: FacebookIcon },
    { label: "X (Twitter)", href: "#", icon: XIcon },
];

type SocialIconProps = { className?: string };

function XIcon({ className }: SocialIconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.9 2H22l-7.2 8.2L23.3 22h-6.6l-5.2-6.8L5.5 22H2.4l7.7-8.8L1.9 2h6.8l4.7 6.2zm-1.2 18h1.8L7.4 3.9H5.4z" />
        </svg>
    );
}

function FacebookIcon({ className }: SocialIconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.5 22v-8.3h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.7-1.6h1.6V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.4H7.5v3.2h2.9V22h3.1z" />
        </svg>
    );
}

function InstagramIcon({ className }: SocialIconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
    );
}

const HeroSlider = () => {
    const [active, setActive] = React.useState(0);
    const [swiper, setSwiper] = React.useState<SwiperClass | null>(null);

    /* Respect users who prefer reduced motion: no autoplay. */
    React.useEffect(() => {
        if (swiper && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            swiper.autoplay?.stop();
        }
    }, [swiper]);

    const scrollToFeatured = () => {
        document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            aria-roledescription="carousel"
            aria-label="StudioSpace featured spaces"
            className="relative isolate h-[92svh] max-h-[860px] min-h-[600px] w-full overflow-hidden bg-[#1a1c23]"
        >
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={900}
                loop
                grabCursor
                autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                className="h-full w-full"
                onSwiper={setSwiper}
                onSlideChange={(instance) => setActive(instance.realIndex)}
            >
                {SLIDES.map((slide, i) => (
                    <SwiperSlide key={slide.image}>
                        <div className="relative h-full w-full">
                            <Image
                                src={slide.image}
                                alt={`${slide.outline} ${slide.solid}`}
                                fill
                                priority={i === 0}
                                sizes="100vw"
                                className="object-cover"
                            />

                            {/* Legibility overlays */}
                            <div className="absolute inset-0 bg-linear-to-r from-[#1a1c23]/95 via-[#1a1c23]/60 to-[#1a1c23]/10" />
                            <div className="absolute inset-0 bg-linear-to-t from-[#1a1c23]/85 via-transparent to-[#1a1c23]/30" />

                            {/* Slide content — pb keeps text clear of the bottom dots/scroll button on small screens */}
                            <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-center px-4 pb-24 sm:px-6 sm:pb-20 lg:px-8 lg:pb-12 lg:pl-32 xl:px-10 xl:pl-32">
                                {/* w-full + max-w-2xl: the block never grows wider than the viewport, so the
                                    paragraph wraps instead of being clipped by long headline words. */}
                                <div className="w-full max-w-2xl">
                                    <h1
                                        className="text-4xl leading-[0.95] font-extrabold tracking-tight text-white uppercase break-words min-[480px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                                        style={{ textShadow: "0 4px 40px rgba(0,0,0,0.35)" }}
                                    >
                                        <span
                                            className="-mr-px block"
                                            style={{
                                                WebkitTextStroke: "1.5px rgba(255,255,255,0.92)",
                                                color: "transparent",
                                            }}
                                        >
                                            {slide.outline}
                                        </span>
                                        <span className="block font-black">{slide.solid}</span>
                                    </h1>

                                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:mt-6 sm:text-base sm:leading-8">
                                        {slide.description}
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                                        <Link
                                            href="/studios"
                                            className="inline-flex items-center justify-center rounded-full bg-[#e63946] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-all duration-200 hover:bg-[#ff4757] hover:shadow-xl hover:shadow-[#e63946]/40 active:scale-[0.98]"
                                        >
                                            Explore Studios
                                        </Link>
                                        <Link
                                            href="/studios"
                                            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/20 hover:shadow-xl active:scale-[0.98]"
                                        >
                                            Host Your Space
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Left sidebar: social links */}
            <div className="absolute top-1/2 left-6 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex">
                <span aria-hidden="true" className="h-10 w-px bg-white/15" />
                {SOCIAL_LINKS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            aria-label={item.label}
                            className="text-white/50 transition-colors duration-200 hover:text-[#e63946]"
                        >
                            <Icon className="size-[18px]" />
                        </a>
                    );
                })}
                <span aria-hidden="true" className="h-10 w-px bg-white/15" />
            </div>

            {/* Right sidebar: vertical slide indicators */}
            <div
                role="tablist"
                aria-label="Slide navigation"
                className="absolute top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
            >
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.image}
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => swiper?.slideToLoop(i)}
                        className="group flex items-center justify-end"
                    >
                        {i === active ? (
                            <span
                                className="rounded-full bg-[#e63946] px-2.5 py-0.5 text-xs font-bold text-white shadow-md shadow-[#e63946]/40 transition-all duration-300"
                            >
                                {String(i + 1).padStart(2, "0")}.
                            </span>
                        ) : (
                            <span className="text-xs font-semibold tracking-widest text-white/40 transition-colors duration-200 group-hover:text-white">
                                {String(i + 1).padStart(2, "0")}.
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom: mobile dots + scroll indicator */}
            <div className="absolute inset-x-0 bottom-5 z-30 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 md:hidden" role="tablist" aria-label="Slide navigation">
                    {SLIDES.map((slide, i) => (
                        <button
                            key={slide.image}
                            type="button"
                            role="tab"
                            aria-selected={i === active}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => swiper?.slideToLoop(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#e63946]" : "w-4 bg-white/40 hover:bg-white/70"
                                }`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={scrollToFeatured}
                    aria-label="Scroll to featured studios"
                    className="flex size-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:border-[#e63946] hover:bg-[#e63946] hover:shadow-lg hover:shadow-[#e63946]/40"
                >
                    <ArrowDown className="size-5 animate-bounce" />
                </button>
            </div>
        </section>
    );
};

export default HeroSlider;
