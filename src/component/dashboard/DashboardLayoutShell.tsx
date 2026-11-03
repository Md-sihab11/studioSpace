"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Aperture,
    CalendarClock,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    PlusCircle,
    Sun,
    User,
    X,
} from "lucide-react";
import { cn } from "cn";
import { useSession, authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/use-toast";

const THEME_STORAGE_KEY = "studiospace_theme";

/* Theme subscription via MutationObserver */
const themeSubscribe = (onStoreChange: () => void) => {
    const observer = new MutationObserver(onStoreChange);

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });

    return () => observer.disconnect();
};

const getThemeSnapshot = () =>
    document.documentElement.classList.contains("dark");

const getThemeServerSnapshot = () => false;

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

/** Exact menu items 1 through 5 */
const DASHBOARD_NAV: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Add Studio", href: "/add-studio", icon: PlusCircle },
    { label: "My Listings", href: "/my-listings", icon: Aperture },
    { label: "My Bookings", href: "/my-bookings", icon: CalendarClock },
    { label: "Profile", href: "/profile", icon: User },
];

const getPageTitle = (pathname: string) => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.startsWith("/add-studio")) return "Add Studio";
    if (pathname.startsWith("/my-listings")) return "My Listings";
    if (pathname.startsWith("/my-bookings")) return "My Bookings";
    if (pathname.startsWith("/profile")) return "Profile";
    if (pathname.startsWith("/studios/edit")) return "Edit Studio";
    return "Dashboard";
};

type DashboardSidebarProps = {
    pathname: string;
    isDark: boolean;
    toggleTheme: () => void;
    onItemClick?: () => void;
};

const DashboardSidebar = ({
    pathname,
    isDark,
    toggleTheme,
    onItemClick,
}: DashboardSidebarProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session } = useSession();
    const user = session?.user;

    const userName = user?.name || user?.email?.split("@")[0] || "Creator";
    const initials = userName
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
                type: "info",
            });
            if (onItemClick) onItemClick();
            router.push("/login");
        } catch {
            toast({
                title: "Logout failed",
                description: "Please try again.",
                type: "error",
            });
        }
    };

    const isItemActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        if (href === "/my-listings") {
            return (
                pathname === "/my-listings" ||
                pathname.startsWith("/my-listings/") ||
                pathname.startsWith("/studios/edit/")
            );
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="flex min-h-full flex-col justify-between">
            {/* Top: User info + Menu Items 1-5 + 6. Theme Toggle */}
            <div className="flex flex-col gap-5">
                {/* User quick badge */}
                {user ? (
                    <Link
                        href="/profile"
                        onClick={onItemClick}
                        className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-2.5 transition-colors hover:border-primary/40 hover:bg-muted"
                    >
                        {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.image}
                                alt={userName}
                                className="size-10 rounded-full border border-primary/20 object-cover"
                            />
                        ) : (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-600 to-blue-600 text-xs font-bold text-white shadow-xs">
                                {initials || <User className="size-4" />}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                                {userName}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </Link>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border p-3 text-xs text-muted-foreground">
                        Creator Portal
                    </div>
                )}

                {/* Navigation items (1 to 5) + 6. Theme */}
                <nav
                    className="flex flex-col gap-1.5"
                    aria-label="Dashboard sidebar navigation"
                >
                    {DASHBOARD_NAV.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onItemClick}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                                    active
                                        ? "bg-primary font-semibold text-primary-foreground shadow-sm shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="size-4.5 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* 6. Theme (Interactive Light/Dark toggle button) */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            isDark
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        className="mt-1 flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                    >
                        <div className="flex items-center gap-3">
                            {isDark ? (
                                <Sun className="size-4.5 text-amber-400" />
                            ) : (
                                <Moon className="size-4.5 text-sky-500" />
                            )}
                            <span>Theme</span>
                        </div>
                        <span className="rounded-full border border-border bg-card px-2 py-0.5 text-xs font-semibold uppercase text-foreground">
                            {isDark ? "Dark" : "Light"}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Bottom: 7. Logout */}
            <div className="mt-8 border-t border-border pt-4">
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
                >
                    <LogOut className="size-4.5 shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

type DashboardLayoutShellProps = {
    children: React.ReactNode;
};

const DashboardLayoutShell = ({ children }: DashboardLayoutShellProps) => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isDark = useSyncExternalStore(
        themeSubscribe,
        getThemeSnapshot,
        getThemeServerSnapshot
    );

    const toggleTheme = () => {
        const nextTheme = isDark ? "light" : "dark";
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    };

    // Lock body scroll on mobile drawer open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    // Close mobile drawer on Escape key
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && mobileOpen) {
                setMobileOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen]);

    const currentTitle = getPageTitle(pathname);

    return (
        <div className="w-full flex-1 border-t border-border/40 bg-background">
            {/* Mobile Top Navigation Bar */}
            <div className="sticky top-16 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open dashboard sidebar menu"
                        className="flex size-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted"
                    >
                        <Menu className="size-5" />
                    </button>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Dashboard
                        </p>
                        <p className="text-sm font-bold text-foreground">
                            {currentTitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            isDark ? "Switch to light mode" : "Switch to dark mode"
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted"
                    >
                        {isDark ? (
                            <Sun className="size-4 text-amber-400" />
                        ) : (
                            <Moon className="size-4 text-sky-500" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Backdrop & Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sliding Drawer */}
                    <div className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-card p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                            <span className="text-sm font-bold tracking-tight text-foreground">
                                Dashboard Menu
                            </span>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close sidebar menu"
                                className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="flex flex-1 flex-col overflow-y-auto">
                            <DashboardSidebar
                                pathname={pathname}
                                isDark={isDark}
                                toggleTheme={toggleTheme}
                                onItemClick={() => setMobileOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Layout Container */}
            <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl">
                {/* Desktop Fixed/Sticky Sidebar */}
                <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-64 shrink-0 flex-col overflow-y-auto border-r border-border p-5 lg:flex">
                    <DashboardSidebar
                        pathname={pathname}
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                    />
                </aside>

                {/* Main Dashboard Content */}
                <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayoutShell;
