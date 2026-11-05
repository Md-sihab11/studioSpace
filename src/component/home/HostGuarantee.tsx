
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    BadgeCheck,
    CreditCard,
    Headphones,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

const GUARANTEES = [
    {
        icon: ShieldCheck,
        title: "Up to $3M host protection",
        description:
            "Every booking is backed by accidental damage coverage, so hosts can relax while their space is in good hands.",
    },
    {
        icon: BadgeCheck,
        title: "Verified studios & creators",
        description:
            "Listings are vetted by our team and every creator is ID-verified before their first booking.",
    },
    {
        icon: CreditCard,
        title: "Secure, on-time payouts",
        description:
            "Payments are held safely and hosts are paid out 24 hours after check-in — no chasing invoices.",
    },
    {
        icon: Headphones,
        title: "24/7 creator support",
        description:
            "Real humans on call around the clock for booking questions, reschedules or anything unexpected.",
    },
];

// Scroll reveal animation
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
function GuaranteeImage() {
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {!imageError ? (
                <Image
                    src="/studio/image.png"
                    alt="Photographer shooting on location at dusk"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onError={() => setImageError(true)}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            ) : (
                <div
                    role="img"
                    aria-label="Studio image unavailable"
                    className="absolute inset-0 flex items-center justify-center bg-gray-200 text-sm text-gray-500 dark:bg-[#202020] dark:text-gray-400"
                >
                    StudioSpace
                </div>
            )}
        </>
    );
}

const HostGuarantee = () => {
    return (
        <section
            id="trust"
            aria-labelledby="trust-heading"
            className="scroll-mt-24 overflow-hidden bg-white py-16 dark:bg-[#0d0d0d] sm:py-20 lg:py-24"
        >
            <div className="mx-auto grid w-full max-w-[1600px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:px-10">

                {/* Visual */}
                <Reveal className="relative order-1">
                    <div className="relative isolate">

                        {/* Main Image */}
                        <div className="group relative h-[340px] overflow-hidden rounded-3xl bg-gray-200 shadow-2xl shadow-black/10 sm:h-[440px] dark:bg-[#202020]">
                            <GuaranteeImage />

                            {/* Image gradient */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-90" />

                            {/* Image bottom caption */}
                            <div className="absolute right-6 bottom-6 left-6">
                                <p className="text-xs font-semibold tracking-[0.2em] text-white/75 uppercase">
                                    Your space. Our commitment.
                                </p>
                                <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                                    Create with confidence.
                                </p>
                            </div>
                        </div>

                        {/* Floating Protection Card */}
                        <div className="absolute -right-2 bottom-8 z-20 w-52 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:-right-6 dark:border-white/10 dark:bg-[#161616]/95">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B7F36B] shadow-sm">
                                    <ShieldCheck className="size-5 text-black" />
                                </span>

                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        $3M coverage
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Host guarantee
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Support Badge */}
                        <div className="absolute -top-4 left-3 z-20 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:-top-6 sm:left-8 dark:border-white/10 dark:bg-[#161616]/95">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex size-2.5">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                                </span>

                                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                    Support online · 24/7
                                </p>
                            </div>
                        </div>

                        {/* Decorative glow */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-12 -left-12 -z-10 size-48 rounded-full bg-teal-400/10 blur-3xl dark:bg-sky-400/10"
                        />
                    </div>
                </Reveal>

                {/* Content */}
                <Reveal className="order-2" delay={150}>
                    <div>
                        {/* Eyebrow */}
                        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                            <span className="h-px w-7 bg-teal-600 dark:bg-sky-400" />
                            Peace of mind, included
                        </p>

                        {/* Heading */}
                        <h2
                            id="trust-heading"
                            className="mt-4 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.8rem] dark:text-white"
                        >
                            Host Guarantee &amp;{" "}
                            <span className="bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">
                                Creator Support
                            </span>
                        </h2>

                        <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                            Great work happens when nobody is worrying about
                            the fine print. StudioSpace protects hosts,
                            creators and every booking in between.
                        </p>

                        {/* Guarantee Cards */}
                        <dl className="mt-9 grid gap-5 sm:grid-cols-2">
                            {GUARANTEES.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <Reveal
                                        key={item.title}
                                        delay={index * 100}
                                    >
                                        <div className="group h-full rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:shadow-xl hover:shadow-black/5 dark:border-white/5 dark:bg-[#131313] dark:hover:border-sky-400/30 dark:hover:bg-[#171717] dark:hover:shadow-black/20">
                                            <div className="flex items-start gap-3.5">
                                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white dark:border-sky-400/10 dark:bg-sky-500/10 dark:text-sky-400 dark:group-hover:bg-sky-500 dark:group-hover:text-white">
                                                    <Icon className="size-5 transition-transform duration-300 group-hover:rotate-3" />
                                                </span>

                                                <div>
                                                    <dt className="text-sm font-bold leading-6 text-gray-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-sky-400">
                                                        {item.title}
                                                    </dt>

                                                    <dd className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                                        {item.description}
                                                    </dd>
                                                </div>
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </dl>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/register"
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 active:scale-[0.98] motion-reduce:transform-none dark:focus-visible:outline-sky-400"
                            >
                                List your studio

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                href="/#how"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 active:scale-[0.98] dark:border-white/15 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:bg-sky-400/5 dark:hover:text-sky-300 dark:focus-visible:outline-sky-400"
                            >
                                See how booking works
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default HostGuarantee;
