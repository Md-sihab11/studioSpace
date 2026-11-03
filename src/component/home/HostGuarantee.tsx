import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CreditCard, Headphones, ShieldCheck } from "lucide-react";

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

const HostGuarantee = () => {
    return (
        <section
            id="trust"
            className="scroll-mt-24 bg-white py-16 dark:bg-[#0d0d0d] sm:py-20 lg:py-24"
        >
            <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:px-10">
                {/* Visual */}
                <div className="relative">
                    <div className="relative h-[360px] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 sm:h-[440px]">
                        <Image
                            src="/studio/image.png"
                            alt="Photographer shooting on location at dusk"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Floating cards */}
                    <div className="absolute -right-2 bottom-8 w-52 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-black/10 backdrop-blur-md sm:-right-6 dark:border-white/10 dark:bg-[#161616]/95">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#B7F36B]">
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

                    <div className="absolute -top-4 left-4 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-md sm:-top-6 sm:left-8 dark:border-white/10 dark:bg-[#161616]/95">
                        <div className="flex items-center gap-2">
                            <span className="relative flex size-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                            </span>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                Support online · 24/7
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copy */}
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                        Peace of mind, included
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                        Host Guarantee &amp; Creator Support
                    </h2>
                    <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                        Great work happens when nobody is worrying about the fine print.
                        StudioSpace protects hosts, creators and every booking in between.
                    </p>

                    <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                        {GUARANTEES.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="flex gap-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                                        <Icon className="size-5" />
                                    </span>
                                    <div>
                                        <dt className="text-sm font-bold text-gray-900 dark:text-white">
                                            {item.title}
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            {item.description}
                                        </dd>
                                    </div>
                                </div>
                            );
                        })}
                    </dl>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
                        >
                            List your studio
                        </Link>
                        <Link
                            href="/#how"
                            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-teal-400 hover:text-teal-700 dark:border-white/15 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
                        >
                            See how booking works
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HostGuarantee;
