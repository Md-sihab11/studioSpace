import React from "react";
import Link from "next/link";
import { CalendarClock, CreditCard, Search, Sparkles } from "lucide-react";

type Step = {
    step: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
    {
        step: "01",
        title: "Discover Spaces",
        description:
            "Filter by city, category, gear and hourly rate until the perfect room surfaces.",
        icon: Search,
    },
    {
        step: "02",
        title: "Select Shoot Hours",
        description:
            "Compare availability, pick your date and reserve the exact hours your shoot needs.",
        icon: CalendarClock,
    },
    {
        step: "03",
        title: "Book Instantly",
        description:
            "Confirm in a couple of clicks with transparent hourly pricing and no back-and-forth.",
        icon: CreditCard,
    },
    {
        step: "04",
        title: "Create & Produce",
        description:
            "Show up, plug in and make something great — your host is one message away.",
        icon: Sparkles,
    },
];

const HowItWorks = () => {
    return (
        <section
            id="how"
            className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-16 sm:py-20 lg:py-24"
        >
            {/* Ambient glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl"
            />

            <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#B7F36B] uppercase">
                        Simple by design
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        How Booking Works
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-400">
                        From first search to final export — booking a studio on StudioSpace
                        takes minutes, not days.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative mt-14">
                    {/* Connecting line (desktop) */}
                    <div
                        aria-hidden="true"
                        className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-linear-to-r from-transparent via-white/15 to-transparent lg:block"
                    />

                    <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li
                                    key={item.step}
                                    className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#B7F36B]/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-lime-500/5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#B7F36B] to-lime-400 shadow-lg shadow-lime-500/20 transition-transform duration-300 group-hover:scale-105">
                                            <Icon className="size-6 text-black" />
                                        </span>
                                        <span className="font-mono text-3xl font-bold text-white/10 transition-colors duration-300 group-hover:text-white/25">
                                            {item.step}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        {item.description}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 flex flex-col items-center gap-4 text-center sm:mt-14">
                    <p className="text-sm text-gray-400">
                        Have a space of your own? Turn your studio into income.
                    </p>
                    <Link
                        href="/#trust"
                        className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-semibold transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                    >
                        Become a Host
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
