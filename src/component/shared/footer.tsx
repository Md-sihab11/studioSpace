"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/lib/use-toast";
import { Check, Mail } from "lucide-react";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) return;

        setSubscribed(true);
        toast({
            title: "Subscribed!",
            description: "Thank you for subscribing to StudioSpace. Check your inbox soon!",
            type: "success",
        });
        setEmail("");
    };

    return (
        <footer className="border-t border-white/10 bg-[#0a0a0a] text-white">
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2.5"
                            aria-label="StudioSpace home"
                        >
                            <svg className="size-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="8" cy="12" r="5" />
                                <circle cx="16" cy="12" r="5" />
                            </svg>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                StudioSpace
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                            The premier marketplace for creators to discover and book verified creative studios by the hour.
                        </p>
                    </div>

                    {/* Studio Categories */}
                    <div>
                        <h4 className="mb-5 text-sm font-semibold tracking-wider uppercase text-white">
                            CATEGORIES
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/studios?category=Photo%20Studio" className="transition-colors hover:text-white">
                                    Photo Studios
                                </Link>
                            </li>
                            <li>
                                <Link href="/studios?category=Film%20Stage" className="transition-colors hover:text-white">
                                    Film &amp; Production
                                </Link>
                            </li>
                            <li>
                                <Link href="/studios?category=Podcast%20Lounge" className="transition-colors hover:text-white">
                                    Podcast Lounges
                                </Link>
                            </li>
                            <li>
                                <Link href="/studios?category=Music%20Suite" className="transition-colors hover:text-white">
                                    Music Suites
                                </Link>
                            </li>
                            <li>
                                <Link href="/studios?category=Art%20Studio" className="transition-colors hover:text-white">
                                    Art Workshops
                                </Link>
                            </li>
                            <li>
                                <Link href="/studios?category=Rehearsal%20Space" className="transition-colors hover:text-white">
                                    Rehearsal Spaces
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-5 text-sm font-semibold tracking-wider uppercase text-white">
                            QUICK LINKS
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/" className="transition-colors hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/studios" className="transition-colors hover:text-white">
                                    Explore Studios
                                </Link>
                            </li>
                            <li>
                                <Link href="/#how" className="transition-colors hover:text-white">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/add-studio" className="transition-colors hover:text-white">
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
                        <h4 className="mb-5 text-sm font-semibold tracking-wider uppercase text-white">
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
                            <li className="pt-2 text-xs text-gray-500">
                                📞 +1 (786) 901-1622
                            </li>
                            <li className="text-xs text-gray-500">
                                ✉️ info@studiospace.com
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-5 text-sm font-semibold tracking-wider uppercase text-white">
                            NEWSLETTER
                        </h4>
                        <p className="mb-4 text-xs leading-5 text-gray-400">
                            Subscribe for exclusive studio promotions and creative inspirations.
                        </p>

                        {subscribed ? (
                            <div className="flex items-center gap-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-400">
                                <Check className="size-4 shrink-0 text-emerald-400" />
                                <span>You are subscribed to studio updates!</span>
                            </div>
                        ) : (
                            <form
                                id="nl"
                                onSubmit={handleSubscribe}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        aria-label="Email address"
                                        className="w-full rounded-lg border border-gray-700 bg-[#111827] px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        aria-label="Subscribe to newsletter"
                                        className="flex shrink-0 items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-white shadow-md shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-lg active:scale-[0.98]"
                                    >
                                        <Mail className="size-4" />
                                    </button>
                                </div>
                                <span className="text-[11px] text-gray-500">
                                    Zero spam. Unsubscribe anytime.
                                </span>
                            </form>
                        )}
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
