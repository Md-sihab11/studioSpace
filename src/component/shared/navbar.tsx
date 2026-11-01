"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Aperture,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Plus,
    Sun,
    User,
    X,
} from "lucide-react";
import { cn } from "cn";
import { useSession, authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/use-toast";

type NavItem = {
    label: string;
    href: string;
    /** Id of the homepage section this link points to (used for scroll-spy). */
    section?: string;
};

const NAV_LINKS: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Studios", href: "/studios", section: "featured" },
    { label: "Categories", href: "/#categories", section: "categories" },
    { label: "How It Works", href: "/#how", section: "how" },
    // { label: "Host Your Space", href: "/#trust", section: "trust" },
    { label: "About Us", href: "/#about", section: "about" },
];

const THEME_STORAGE_KEY = "studiospace_theme";

const themeSubscribe = (onStoreChange: () => void) => {
    const observer = new MutationObserver(onStoreChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
    return () => observer.disconnect();
};

const getThemeSnapshot = () => document.documentElement.classList.contains("dark");
const getThemeServerSnapshot = () => false;

/* ------------------------------------------------------------------ */

const Navbar = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const isDark = useSyncExternalStore(themeSubscribe, getThemeSnapshot, getThemeServerSnapshot);
    const { data: session } = useSession();
    const user = session?.user;
    const { toast } = useToast();
    const profileRef = useRef<HTMLDivElement | null>(null);

    /* Shadow appears once the page is scrolled for a floating, premium feel. */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        requestAnimationFrame(onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Scroll-spy: highlight the section currently in view on the homepage. */
    useEffect(() => {
        if (pathname !== "/") return;

        const sections = NAV_LINKS.map((item) =>
            item.section ? document.getElementById(item.section) : null
        ).filter((el): el is HTMLElement => Boolean(el));

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveSection(visible.target.id);
            },
            { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.25, 0.5] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [pathname]);

    /* Close the profile dropdown when clicking outside or pressing Escape. */
    useEffect(() => {
        if (!profileOpen) return;

        const onClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setProfileOpen(false);
        };

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [profileOpen]);

    /* Lock body scroll while the mobile menu is open. */
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark", !isDark);
        window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "light" : "dark");
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
            type: "info",
        });
        setProfileOpen(false);
    };

    const isActiveLink = (item: NavItem) => {
        if (item.href === "/") return pathname === "/" && !activeSection;
        if (item.section) return pathname === "/" && activeSection === item.section;
        return pathname === item.href;
    };

    const userName = user?.name || user?.email || "Account";
    const initials = userName
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-all duration-300",
                isScrolled
                    ? "border-gray-200/80 bg-white/85 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/85"
                    : "border-transparent bg-white/60 backdrop-blur-md dark:bg-[#0a0a0a]/60"
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[72px] lg:px-10">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex shrink-0 items-center gap-2.5"
                    aria-label="StudioSpace home"
                >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-600 to-blue-600 shadow-md shadow-blue-600/20 transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-105 dark:from-sky-500 dark:to-blue-600">
                        <Aperture className="size-5 text-white" strokeWidth={2.25} />
                    </span>
                    <span className="text-xl font-bold tracking-tight">
                        <span className="bg-linear-to-r from-teal-700 to-blue-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">
                            Studio
                        </span>
                        <span className="text-gray-900 dark:text-white">Space</span>
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                                isActiveLink(item)
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                            )}
                        >
                            {item.label}
                            <span
                                className={cn(
                                    "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-teal-500 to-blue-500 transition-transform duration-300",
                                    isActiveLink(item) ? "scale-x-100" : "scale-x-0"
                                )}
                            />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-teal-400 hover:text-teal-600 dark:border-white/10 dark:text-gray-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
                    >
                        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </button>

                    {user ? (
                        /* Authenticated: profile dropdown */
                        <div ref={profileRef} className="relative hidden sm:block">
                            <button
                                type="button"
                                onClick={() => setProfileOpen((open) => !open)}
                                aria-haspopup="menu"
                                aria-expanded={profileOpen}
                                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-2.5 transition-all duration-200 hover:border-teal-400 hover:shadow-md dark:border-white/10 dark:hover:border-sky-400"
                            >
                                <span className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-teal-600 to-blue-600 text-xs font-bold text-white">
                                    {initials || <User className="size-4" />}
                                </span>
                                <span className="max-w-28 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {userName}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "size-4 text-gray-400 transition-transform duration-200",
                                        profileOpen && "rotate-180"
                                    )}
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#141414]"
                                >
                                    <div className="border-b border-gray-100 px-3 py-2.5 dark:border-white/10">
                                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                            {userName}
                                        </p>
                                        {user.email && (
                                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        <LayoutDashboard className="size-4" /> Dashboard
                                    </Link>
                                    <Link
                                        href="/add-studio"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        <Plus className="size-4" /> Add New Studio
                                    </Link>
                                    <Link
                                        href="/my-listings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        <Aperture className="size-4" /> My Studio Listings
                                    </Link>
                                    <Link
                                        href="/my-bookings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        <User className="size-4" /> My Bookings
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                    >
                                        <LogOut className="size-4" /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Unauthenticated: login + register */
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href="/login"
                                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-teal-400 hover:text-teal-600 dark:border-white/15 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-[#B7F36B] px-4 py-2 text-sm font-semibold text-black shadow-md shadow-lime-500/20 transition-all duration-200 hover:bg-[#a5e653] hover:shadow-lg hover:shadow-lime-500/30 active:scale-[0.98]"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu trigger */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-teal-400 hover:text-teal-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-400 lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto rounded-b-3xl border-b border-gray-200 bg-white px-6 pb-8 pt-5 shadow-2xl dark:border-white/10 dark:bg-[#0f0f0f]">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2.5"
                            >
                                <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-600 to-blue-600">
                                    <Aperture className="size-5 text-white" strokeWidth={2.25} />
                                </span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    StudioSpace
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                                className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 dark:border-white/10 dark:text-gray-300"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
                            {NAV_LINKS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                                        isActiveLink(item)
                                            ? "bg-teal-50 text-teal-700 dark:bg-sky-500/10 dark:text-sky-300"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 dark:border-white/10">
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:bg-white/10 dark:text-white"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/add-studio"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full border border-teal-400 px-4 py-3 text-center text-sm font-semibold text-teal-600 dark:border-sky-400 dark:text-sky-400"
                                    >
                                        Add New Studio
                                    </Link>
                                    <Link
                                        href="/my-listings"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:border-white/15 dark:text-white"
                                    >
                                        My Studio Listings
                                    </Link>
                                    <Link
                                        href="/my-bookings"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:border-white/15 dark:text-white"
                                    >
                                        My Bookings
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSignOut();
                                            setMobileOpen(false);
                                        }}
                                        className="rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/30 dark:text-red-400"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:border-white/15 dark:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-full bg-[#B7F36B] px-4 py-3 text-center text-sm font-semibold text-black shadow-md shadow-lime-500/20"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
