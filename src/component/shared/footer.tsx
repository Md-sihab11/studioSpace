"use client";

import Link from "next/link";

const Footer = () => {
    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <footer className="border-t border-white/10 bg-[#0a0a0a] text-white">
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2.5"
                            aria-label="StudioSpace home"
                        >
                            <svg className="size-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="8" cy="12" r="5" />
                                <circle cx="16" cy="12" r="5" />
                            </svg>
                            <span className="text-3xl font-bold tracking-tight text-white">
                                StudioSpace
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                            Your gateway to extraordinary creative spaces around the world.
                        </p>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold tracking-wide uppercase text-white">
                            NEWSLETTER
                        </h4>
                        <p className="mb-5 text-sm leading-6 text-gray-400">
                            Subscribe for exclusive studio deals and inspiration.
                        </p>
                        <form
                            id="nl"
                            onSubmit={handleSubscribe}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Enter email"
                                aria-label="Email address"
                                className="flex-1 rounded-lg border border-gray-700 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center rounded-lg bg-blue-500 text-white px-4 py-3 shadow-md shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-lg active:scale-[0.98]"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M22 2l-11 13" />
                                    <path d="M22 2l-11 13" />
                                    <path d="M22 2l-2.2 2" />
                                    <path d="M17.8 22L22 17.8" />
                                    <path d="M22 2l-11 13" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold tracking-wide uppercase text-white">
                            QUICK LINKS
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/#featured" className="transition-colors hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/#how" className="transition-colors hover:text-white">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/#trust" className="transition-colors hover:text-white">
                                    Host Your Space
                                </Link>
                            </li>
                            <li>
                                <Link href="/#trust" className="transition-colors hover:text-white">
                                    Host Guarantee
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold tracking-wide uppercase text-white">
                            SUPPORT
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/dashboard" className="transition-colors hover:text-white">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="mb-5 text-base font-semibold tracking-wide uppercase text-white">
                            CONTACT US
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                786 901 1622
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                info@studiospace.com
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-400">
                        © 2026 StudioSpace. All rights reserved.
                    </span>

                    <div className="flex flex-wrap items-center gap-6">
                        <a href="#" className="text-gray-400 transition-colors hover:text-white">
                            Privacy
                        </a>
                        <a href="#" className="text-gray-400 transition-colors hover:text-white">
                            Terms
                        </a>
                        <a href="#" className="text-gray-400 transition-colors hover:text-white">
                            Cookies
                        </a>

                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="X" className="text-gray-400 transition-colors hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.9 2H22l-7.2 8.2L23.3 22h-6.6l-5.2-6.8L5.5 22H2.4l7.7-8.8L1.9 2h6.8l4.7 6.2zm-1.2 18h1.8L7.4 3.9H5.4z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-400 transition-colors hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.5 9h3.8v11H4.5zM6.4 3.5a2.2 2.2 0 110 4.4 2.2 2.2 0 010-4.4zM10.5 9h3.6v1.5c.5-.9 1.8-1.8 3.6-1.8 3.8 0 4.5 2.4 4.5 5.6V20h-3.8v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-3.8z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="text-gray-400 transition-colors hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
