"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Aperture,
    ArrowRight,
    CalendarClock,
    LayoutDashboard,
    LogOut,
    Mail,
    Plus,
    ShieldCheck,
    User as UserIcon,
} from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayoutShell from "@/component/dashboard/DashboardLayoutShell";

const ProfilePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
                type: "info",
            });
            router.push("/login");
        } catch {
            toast({
                title: "Logout failed",
                description: "Please try again.",
                type: "error",
            });
        }
    };

    // 1. Loading State
    if (isPending) {
        return (
            <DashboardLayoutShell>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5">
                        <Skeleton className="size-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <Skeleton className="h-44 w-full rounded-2xl" />
                        <Skeleton className="h-44 w-full rounded-2xl" />
                    </div>
                </div>
            </DashboardLayoutShell>
        );
    }

    // 2. Unauthenticated State
    if (!user) {
        return (
            <DashboardLayoutShell>
                <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <UserIcon className="size-8" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                        Sign in to view your profile
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your profile information, listings, and bookings are tied to your account.
                    </p>
                    <div className="mt-6 flex w-full gap-3">
                        <Link href="/login" className="flex-1">
                            <Button className="w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/register" className="flex-1">
                            <Button variant="outline" className="w-full rounded-full">
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>
            </DashboardLayoutShell>
        );
    }

    const userName = user.name || user.email?.split("@")[0] || "StudioSpace User";
    const initials = userName
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    return (
        <DashboardLayoutShell>
            <div className="flex flex-col gap-8">
                {/* Profile Header */}
                <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-5">
                    {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.image}
                            alt={userName}
                            className="size-20 rounded-full border-2 border-primary/20 object-cover shadow-sm sm:size-24"
                        />
                    ) : (
                        <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-teal-600 to-blue-600 text-2xl font-bold text-white shadow-md sm:size-24">
                            {initials || <UserIcon className="size-10" />}
                        </div>
                    )}

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {userName}
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#B7F36B] px-2.5 py-0.5 text-xs font-bold text-black">
                                <ShieldCheck className="size-3.5" />
                                Verified Member
                            </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Mail className="size-4 shrink-0" />
                            {user.email}
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full sm:w-auto rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="size-4" />
                    Sign out
                </Button>
            </div>

            {/* Account Details & Role */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card className="rounded-2xl border-border bg-card p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg font-bold">
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Your verified identity across the marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4 space-y-3 p-0 text-sm">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Display Name</span>
                            <span className="font-semibold text-foreground">{userName}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Email Address</span>
                            <span className="font-semibold text-foreground truncate max-w-[200px]">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Account Status</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active &amp; Verified</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-muted-foreground">Protection Tier</span>
                            <span className="font-semibold text-foreground">$3M Host &amp; Guest Guarantee</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border bg-card p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg font-bold">
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Jump directly into your creative workflows.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4 flex flex-col gap-2.5 p-0">
                        <Link href="/add-studio">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <Plus className="size-4 text-teal-600 dark:text-sky-400" />
                                    Add New Studio
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                        <Link href="/my-listings">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <Aperture className="size-4 text-blue-600 dark:text-blue-400" />
                                    My Studio Listings
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                        <Link href="/my-bookings">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarClock className="size-4 text-purple-600 dark:text-purple-400" />
                                    My Bookings
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <LayoutDashboard className="size-4 text-amber-600 dark:text-amber-400" />
                                    Creator Dashboard
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
            </div>
        </DashboardLayoutShell>
    );
};

export default ProfilePage;
