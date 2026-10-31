"use client";

import React from "react";
import Image from "next/image";

const Footer = () => {
    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <footer className="border-t border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-gray-400">
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* Brand */}
                    <div>
                        <a
                            href="#top"
                            className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 transition-colors hover:text-lime-500 dark:text-white"
                        >
                            {/* <Image
                                src="img.png"
                                alt="StudioSpace Logo"
                                width={180}
                                height={180}
                                priority
                                className="h-auto w-40 object-contain"
                            /> */}
                        </a>

                        <p className="mt-4 max-w-xs text-sm leading-7">
                            Our mission is to put great creative spaces within
                            reach of every maker, and to help hosts earn from
                            the rooms they love.
                        </p>

                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#"
                                aria-label="X"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-lime-400 hover:bg-lime-400 hover:text-black dark:border-white/10"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.9 2H22l-7.2 8.2L23.3 22h-6.6l-5.2-6.8L5.5 22H2.4l7.7-8.8L1.9 2h6.8l4.7 6.2zm-1.2 18h1.8L7.4 3.9H5.4z" />
                                </svg>
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-lime-400 hover:bg-lime-400 hover:text-black dark:border-white/10"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                                </svg>
                            </a>

                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-lime-400 hover:bg-lime-400 hover:text-black dark:border-white/10"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.5 9h3.8v11H4.5zM6.4 3.5a2.2 2.2 0 110 4.4 2.2 2.2 0 010-4.4zM10.5 9h3.6v1.5c.5-.9 1.8-1.8 3.6-1.8 3.8 0 4.5 2.4 4.5 5.6V20h-3.8v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-3.8z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
                            Quick Links
                        </h4>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#featured" className="transition-colors hover:text-lime-500">
                                    Explore Studios
                                </a>
                            </li>
                            <li>
                                <a href="#how" className="transition-colors hover:text-lime-500">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-lime-500">
                                    Host Your Space
                                </a>
                            </li>
                            <li>
                                <a href="#trust" className="transition-colors hover:text-lime-500">
                                    Host Guarantee
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
                            Categories
                        </h4>

                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="transition-colors hover:text-lime-500">Photography</a></li>
                            <li><a href="#" className="transition-colors hover:text-lime-500">Film &amp; Sound</a></li>
                            <li><a href="#" className="transition-colors hover:text-lime-500">Podcast Rooms</a></li>
                            <li><a href="#" className="transition-colors hover:text-lime-500">Music Suites</a></li>
                            <li><a href="#" className="transition-colors hover:text-lime-500">Art Workshops</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
                            Stay in the loop
                        </h4>

                        <p className="mb-5 text-sm leading-6">
                            New studios and creator tips, once a month.
                        </p>

                        <form
                            id="nl"
                            onSubmit={handleSubscribe}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="you@email.com"
                                aria-label="Email address"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-white/10 dark:bg-[#171717] dark:text-white"
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-[#B7F36B] px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-[#a5e653] hover:shadow-lg hover:shadow-lime-500/20 active:scale-[0.98]"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="mt-14 flex flex-col gap-4 border-t border-gray-200 pt-7 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                    <span>
                        © 2026 StudioSpace. All rights reserved.
                    </span>

                    <div className="flex flex-wrap items-center gap-4">
                        <a href="#" className="transition-colors hover:text-lime-500">
                            Privacy
                        </a>
                        <a href="#" className="transition-colors hover:text-lime-500">
                            Terms
                        </a>
                        <a href="#" className="transition-colors hover:text-lime-500">
                            Cookies
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;