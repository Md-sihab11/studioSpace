import React from "react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
    { value: "2,400+", label: "Studios listed" },
    { value: "120", label: "Cities covered" },
    { value: "85k+", label: "Creators served" },
    { value: "4.9", label: "Average rating" },
];

const About = () => {
    return (
        <section
            id="about"
            className="scroll-mt-24 bg-gray-50 py-16 dark:bg-[#0a0a0a] sm:py-20 lg:py-24"
        >
            <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:px-10">
                {/* Copy */}
                <div className="order-2 lg:order-1">
                    <p className="text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                        About StudioSpace
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                        The marketplace built for{" "}
                        <span className="bg-linear-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">
                            people who make things
                        </span>
                    </h2>
                    <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                        StudioSpace started with a simple frustration: finding a great
                        studio shouldn&apos;t take a week of calls and dead-end emails.
                        We bring photographers, filmmakers, musicians and hosts into one
                        transparent marketplace — verified spaces, honest reviews and
                        booking that takes two minutes.
                    </p>
                    <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                        Our mission is to put great creative spaces within reach of every
                        maker, and to help hosts earn from the rooms they love.
                    </p>

                    {/* Stats */}
                    <dl className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#131313]"
                            >
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </dd>
                                <dd className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {stat.label}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/#featured"
                            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-700 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Start exploring
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-teal-400 hover:text-teal-700 dark:border-white/15 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
                        >
                            Join as a host
                        </Link>
                    </div>
                </div>

                {/* Collage */}
                <div className="relative order-1 lg:order-2">
                    <div className="relative h-[380px] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 sm:h-[460px]">
                        <Image
                            src="/studio/image1.png"
                            alt="StudioSpace studio interior with professional lighting"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-8 -left-2 h-40 w-40 overflow-hidden rounded-3xl border-4 border-white shadow-2xl shadow-black/15 sm:-left-8 sm:h-52 sm:w-52 dark:border-[#0a0a0a]">
                        <Image
                            src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=600&q=80"
                            alt="Home studio workstation with keyboard and microphone"
                            fill
                            sizes="208px"
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute -top-4 right-4 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-md sm:-top-6 sm:right-8 dark:border-white/10 dark:bg-[#161616]/95">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Trusted by teams at</p>
                        <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
                            250+ creative studios
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
