"use client";

import React from "react";
import Link from "next/link";
import {
    Aperture,
    ArrowRight,
    CalendarClock,
    Compass,
    PlusCircle,
    ShieldCheck,
    Sparkles,
    User,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const userName = user?.name || user?.email?.split("@")[0] || "Creator";

    return (
        <div className="flex flex-col gap-8">
            {/* Header banner */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Welcome back, {userName} 👋
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your hosted spaces, studio reservations, and account settings from one central place.
                    </p>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <Link href="/add-studio">
                        <Button className="rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                            <PlusCircle className="size-4" />
                            Add Studio
                        </Button>
                    </Link>
                    <Link href="/studios">
                        <Button variant="outline" className="rounded-full">
                            <Compass className="size-4" />
                            Explore
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Action Navigation Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Add Studio */}
                <Card className="flex flex-col justify-between rounded-2xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div>
                        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-sky-500/10 dark:text-sky-400">
                            <Sparkles className="size-5" />
                        </span>
                        <CardTitle className="mt-4 text-lg font-bold">
                            Add New Studio
                        </CardTitle>
                        <CardDescription className="mt-2 text-xs leading-5">
                            Publish a new creative space with hourly rates, amenities, and photos.
                        </CardDescription>
                    </div>
                    <Link href="/add-studio" className="mt-5">
                        <Button variant="outline" size="sm" className="w-full justify-between rounded-xl">
                            <span>Create listing</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </Link>
                </Card>

                {/* 2. My Listings */}
                <Card className="flex flex-col justify-between rounded-2xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div>
                        <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <Aperture className="size-5" />
                        </span>
                        <CardTitle className="mt-4 text-lg font-bold">
                            My Studio Listings
                        </CardTitle>
                        <CardDescription className="mt-2 text-xs leading-5">
                            Review, edit specs, update pricing, or remove your active spaces.
                        </CardDescription>
                    </div>
                    <Link href="/my-listings" className="mt-5">
                        <Button variant="outline" size="sm" className="w-full justify-between rounded-xl">
                            <span>Manage listings</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </Link>
                </Card>

                {/* 3. My Bookings */}
                <Card className="flex flex-col justify-between rounded-2xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div>
                        <span className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                            <CalendarClock className="size-5" />
                        </span>
                        <CardTitle className="mt-4 text-lg font-bold">
                            My Bookings
                        </CardTitle>
                        <CardDescription className="mt-2 text-xs leading-5">
                            Track your session schedules, pending requests, and booking totals.
                        </CardDescription>
                    </div>
                    <Link href="/my-bookings" className="mt-5">
                        <Button variant="outline" size="sm" className="w-full justify-between rounded-xl">
                            <span>View bookings</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </Link>
                </Card>

                {/* 4. Profile & Account */}
                <Card className="flex flex-col justify-between rounded-2xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div>
                        <span className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            <User className="size-5" />
                        </span>
                        <CardTitle className="mt-4 text-lg font-bold">
                            User Profile
                        </CardTitle>
                        <CardDescription className="mt-2 text-xs leading-5">
                            Inspect your verified creator identity and connected credentials.
                        </CardDescription>
                    </div>
                    <Link href="/profile" className="mt-5">
                        <Button variant="outline" size="sm" className="w-full justify-between rounded-xl">
                            <span>Open profile</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </Link>
                </Card>
            </div>

            {/* Information & Platform Guidance */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Host Assurance */}
                <Card className="rounded-2xl border-border bg-card p-6">
                    <CardHeader className="p-0">
                        <div className="flex items-center gap-2 text-teal-600 dark:text-sky-400">
                            <ShieldCheck className="size-5" />
                            <span className="text-xs font-bold tracking-wider uppercase">
                                Host Assurance
                            </span>
                        </div>
                        <CardTitle className="mt-2 text-lg font-bold">
                            StudioSpace Host Protection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-3 p-0 text-sm leading-6 text-muted-foreground">
                        <p>
                            Every workspace published through your account includes verified creator authentication,
                            on-time automated payouts held safely, and accidental damage guarantee coverage.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                href="/#trust"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                                Learn more about Host Guarantee
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Getting Started Guide */}
                <Card className="rounded-2xl border-border bg-card p-6">
                    <CardHeader className="p-0">
                        <div className="flex items-center gap-2 text-primary">
                            <Compass className="size-5" />
                            <span className="text-xs font-bold tracking-wider uppercase">
                                Quick Navigation
                            </span>
                        </div>
                        <CardTitle className="mt-2 text-lg font-bold">
                            Need Inspiration?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-3 p-0 text-sm leading-6 text-muted-foreground">
                        <p>
                            Explore hundreds of photo daylight lofts, cyclorama studios, podcast suites, and recording rooms
                            available in top cities across the globe.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <Link
                                href="/studios"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                                Browse All Studios
                                <ArrowRight className="size-3" />
                            </Link>
                            <Link
                                href="/#how"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
                            >
                                How booking works
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
