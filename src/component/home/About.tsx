
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
    { value: 2400, suffix: "+", label: "Studios listed" },
    { value: 120, suffix: "", label: "Cities covered" },
    { value: 85000, suffix: "+", label: "Creators served", compact: true },
    { value: 4.9, suffix: "", label: "Average rating", decimals: 1 },
];

// Animated counter
function AnimatedCounter({
    value,
    suffix = "",
    compact = false,
    decimals = 0,
}: {
    value: number;
    suffix?: string;
    compact?: boolean;
    decimals?: number;
}) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setCount(value);
            return;
        }

        const duration = 1400;
        const startTime = performance.now();
        let animationFrame: number;

        const animate = (currentTime: number) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 4);

            setCount(value * eased);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [started, value]);

    const formatted = compact
        ? `${(count / 1000).toFixed(0)}k`
        : count.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
          });

    return (
        <span ref={ref} aria-label={`${value}${suffix}`}>
            {formatted}{suffix}
        </span>
    );
}

// Scroll reveal
function Reveal({
    children,
    className = "",
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// Image with fallback
function StudioImage({
    src,
    alt,
    sizes,
    priority = false,
}: {
    src: string;
    alt: string;
    sizes: string;
    priority?: boolean;
}) {
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {!imageError ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes={sizes}
                    onError={() => setImageError(true)}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            ) : (
                <div
                    role="img"
                    aria-label={`${alt} unavailable`}
                    className="absolute inset-0 flex items-center justify-center bg-gray-200 text-sm text-gray-500 dark:bg-[#202020] dark:text-gray-400"
                >
                    StudioSpace
                </div>
            )}
        </>
    );
}

const About = () => {
    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="scroll-mt-24 overflow-hidden bg-gray-50 py-16 dark:bg-[#0a0a0a] sm:py-20 lg:py-24"
        >
            <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:px-10">

                {/* Content */}
                <Reveal className="order-2 lg:order-1">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                            <span className="h-px w-7 bg-teal-600 dark:bg-sky-400" />
                            About StudioSpace
                        </p>

                        <h2
                            id="about-heading"
                            className="mt-4 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.8rem] dark:text-white"
                        >
                            The marketplace built for{" "}
                            <span className="bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">
                                people who make things
                            </span>
                        </h2>

                        <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                            StudioSpace started with a simple frustration:
                            finding a great studio shouldn&apos;t take a week
                            of calls and dead-end emails. We bring photographers,
                            filmmakers, musicians and hosts into one transparent
                            marketplace — verified spaces, honest reviews and
                            booking that takes two minutes.
                        </p>

                        <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-400">
                            Our mission is to put great creative spaces within
                            reach of every maker, and to help hosts earn from
                            the rooms they love.
                        </p>

                        {/* Statistics */}
                        <dl className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                            {STATS.map((stat, index) => (
                                <Reveal
                                    key={stat.label}
                                    delay={index * 100}
                                >
                                    <div className="group h-full rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg dark:border-white/10 dark:bg-[#131313] dark:hover:border-sky-400/40">
                                        <dt className="sr-only">
                                            {stat.label}
                                        </dt>

                                        <dd className="text-2xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-teal-700 sm:text-3xl dark:text-white dark:group-hover:text-sky-400">
                                            <AnimatedCounter
                                                value={stat.value}
                                                suffix={stat.suffix}
                                                compact={stat.compact}
                                                decimals={stat.decimals}
                                            />
                                        </dd>

                                        <dd className="mt-2 text-[11px] font-medium text-gray-500 sm:text-xs dark:text-gray-400">
                                            {stat.label}
                                        </dd>
                                    </div>
                                </Reveal>
                            ))}
                        </dl>

                        {/* CTA */}
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/#featured"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus-visible:outline-sky-400"
                            >
                                Start exploring
                                <span aria-hidden="true">→</span>
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 active:scale-[0.98] dark:border-white/15 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:bg-sky-400/5 dark:hover:text-sky-300 dark:focus-visible:outline-sky-400"
                            >
                                Join as a host
                            </Link>
                        </div>
                    </div>
                </Reveal>

                {/* Image Collage */}
                <Reveal
                    className="relative order-1 lg:order-2"
                    delay={150}
                >
                    <div className="relative isolate">
                        {/* Main Image */}
                        <div className="group relative h-[340px] overflow-hidden rounded-3xl bg-gray-200 shadow-2xl shadow-black/10 sm:h-[460px] dark:bg-[#202020]">
                            <StudioImage
                                src="/studio/image1.png"
                                alt="Professional creative studio interior with lighting equipment"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Floating Secondary Image */}
                        <div className="group absolute -bottom-7 -left-2 h-36 w-36 overflow-hidden rounded-3xl border-4 border-white bg-gray-200 shadow-2xl shadow-black/15 sm:-left-8 sm:h-52 sm:w-52 dark:border-[#0a0a0a] dark:bg-[#202020]">
                            <StudioImage
                                src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=600&q=80"
                                alt="Music studio workstation with professional audio equipment"
                                sizes="(max-width: 640px) 144px, 208px"
                            />
                        </div>

                        {/* Floating Trust Badge */}
                        <div className="absolute -top-4 right-2 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:-top-6 sm:right-8 dark:border-white/10 dark:bg-[#161616]/95">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Built for creative spaces
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                One space. Endless possibilities.
                            </p>
                        </div>

                        {/* Decorative Background */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-10 -bottom-12 -z-10 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl dark:bg-sky-400/10"
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default About;
