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
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl"
            />

            <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
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

                {/* Timeline: vertical on mobile/tablet, horizontal on laptop+ */}
                <div className="relative mt-14">
                    <div
                        aria-hidden="true"
                        className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-linear-to-r from-transparent via-[#B7F36B]/40 to-transparent lg:block"
                    />

                    <ol className="relative flex flex-col gap-8 sm:mx-auto sm:max-w-2xl lg:max-w-none lg:grid lg:grid-cols-4 lg:gap-6">
                        {STEPS.map((item, index) => {
                            const Icon = item.icon;
                            const isLast = index === STEPS.length - 1;
                            return (
                                <li
                                    key={item.step}
                                    className="group relative flex gap-5 lg:flex-col lg:gap-0"
                                >
                                    {/* Mobile/tablet: spine segment reaching the next node */}
                                    {!isLast && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute top-14 -bottom-8 left-7 w-px bg-[#B7F36B]/30 transition-colors duration-300 group-hover:bg-[#B7F36B]/70 lg:hidden"
                                        />
                                    )}

                                    {/* Laptop+: short stem from the node down to its card */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-14 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-[#B7F36B]/30 transition-colors duration-300 group-hover:bg-[#B7F36B]/70 lg:block"
                                    />

                                    {/* Node sitting on the timeline */}
                                    <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#B7F36B] to-lime-400 shadow-[0_0_0_6px_rgba(183,243,107,0.06)] transition-transform duration-300 group-hover:scale-110 lg:self-center">
                                        <Icon className="size-6 text-black" />
                                        <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-[#050505] text-[10px] font-bold text-[#B7F36B] ring-1 ring-[#B7F36B]/50">
                                            {item.step}
                                        </span>
                                    </span>

                                    <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#B7F36B]/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-lime-500/5 lg:mt-6">
                                        <h3 className="text-base font-bold text-white sm:text-lg">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>

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
