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
    PanelLeftClose,
    PanelLeftOpen,
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
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
};

const DashboardSidebar = ({
    pathname,
    isDark,
    toggleTheme,
    onItemClick,
    isCollapsed = false,
    onToggleCollapse,
}: DashboardSidebarProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session } = useSession();
    const user = session?.user;
    const [avatarError, setAvatarError] = useState(false);

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
        <div className="flex flex-1 flex-col justify-between">
            {/* Top: Header with toggle + User info + Menu Items 1-5 + 6. Theme Toggle */}
            <div className="flex flex-col gap-4">
                {/* Header row with collapse/expand toggle button */}
                {onToggleCollapse && (
                    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                        {!isCollapsed && (
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Creator Portal
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                            {isCollapsed ? (
                                <PanelLeftOpen className="size-4.5" />
                            ) : (
                                <PanelLeftClose className="size-4.5" />
                            )}
                        </button>
                    </div>
                )}

                {/* User quick badge */}
                {user ? (
                    <Link
                        href="/profile"
                        onClick={onItemClick}
                        title={isCollapsed ? `${userName} (${user.email})` : undefined}
                        className={cn(
                            "group flex items-center rounded-2xl border border-border/70 bg-muted/40 transition-colors hover:border-primary/40 hover:bg-muted",
                            isCollapsed ? "justify-center p-2 size-12 mx-auto" : "gap-3 p-2.5"
                        )}
                    >
                        {user.image && !avatarError ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.image}
                                alt={userName}
                                onError={() => setAvatarError(true)}
                                className="size-10 rounded-full border border-primary/20 object-cover shrink-0"
                            />
                        ) : (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-zinc-800 dark:text-white text-xs font-bold shadow-xs">
                                {initials || <User className="size-4" />}
                            </div>
                        )}
                        {!isCollapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                                    {userName}
                                </p>
                                <p className="truncate text-[11px] text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </Link>
                ) : (
                    !isCollapsed && (
                        <div className="rounded-2xl border border-dashed border-border p-3 text-xs text-muted-foreground">
                            Creator Portal
                        </div>
                    )
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
                                title={isCollapsed ? item.label : undefined}
                                className={cn(
                                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                                    isCollapsed
                                        ? "size-10 justify-center mx-auto"
                                        : "gap-3 px-3.5 py-2.5",
                                    active
                                        ? "bg-primary font-semibold text-primary-foreground shadow-sm shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="size-4.5 shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
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
                        title={isCollapsed ? `Theme: ${isDark ? "Dark" : "Light"}` : undefined}
                        className={cn(
                            "mt-1 flex items-center rounded-xl text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground",
                            isCollapsed
                                ? "size-10 justify-center mx-auto"
                                : "w-full justify-between px-3.5 py-2.5"
                        )}
                    >
                        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                            {isDark ? (
                                <Sun className="size-4.5 text-amber-400 shrink-0" />
                            ) : (
                                <Moon className="size-4.5 text-sky-500 shrink-0" />
                            )}
                            {!isCollapsed && <span>Theme</span>}
                        </div>
                        {!isCollapsed && (
                            <span className="rounded-full border border-border bg-card px-2 py-0.5 text-xs font-semibold uppercase text-foreground">
                                {isDark ? "Dark" : "Light"}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Bottom: 7. Logout */}
            <div className="mt-auto pt-6">
                <button
                    type="button"
                    onClick={handleSignOut}
                    title={isCollapsed ? "Logout" : undefined}
                    aria-label="Logout"
                    className={cn(
                        "flex items-center rounded-xl text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10",
                        isCollapsed
                            ? "size-10 justify-center mx-auto"
                            : "w-full gap-3 px-3.5 py-2.5"
                    )}
                >
                    <LogOut className="size-4.5 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
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
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            try {
                window.localStorage.setItem("studiospace_sidebar_collapsed", String(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

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
                                isCollapsed={false}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Layout Container */}
            <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
                {/* Desktop Fixed/Sticky Sidebar */}
                <aside
                    className={cn(
                        "sticky top-[72px] hidden h-[calc(100vh-72px)] shrink-0 flex-col overflow-y-auto border-r border-border py-8 transition-all duration-300 ease-in-out lg:flex",
                        isCollapsed ? "w-18 pr-3 pl-0" : "w-64 pr-6 pl-0"
                    )}
                >
                    <DashboardSidebar
                        pathname={pathname}
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        isCollapsed={isCollapsed}
                        onToggleCollapse={toggleCollapse}
                    />
                </aside>

                {/* Main Dashboard Content */}
                <main
                    className={cn(
                        "min-w-0 flex-1 py-8 transition-all duration-300 ease-in-out",
                        isCollapsed ? "pl-4 lg:pl-6" : "pl-0 lg:pl-8"
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayoutShell;
