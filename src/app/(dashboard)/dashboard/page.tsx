import React from "react";
import Link from "next/link";
import { Construction, ArrowRight, LayoutDashboard } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

const DashboardPage = () => {
    return (
        <div className="px-4 py-10 sm:px-6 lg:px-10">
            <Empty className="border border-dashed border-gray-200 bg-white py-24 dark:border-white/10 dark:bg-[#131313]">
                <EmptyHeader>
                    <EmptyMedia>
                        <span className="flex size-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-500/10 dark:text-amber-400">
                            <Construction className="size-9" strokeWidth={1.5} />
                        </span>
                    </EmptyMedia>
                    <EmptyTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Dashboard coming soon
                    </EmptyTitle>
                    <EmptyDescription className="max-w-sm text-sm leading-6">
                        Your host dashboard — managing listings, tracking bookings and
                        viewing payouts — is under active development. Explore the
                        marketplace while you wait.
                    </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <Link
                        id="go-home-from-dashboard"
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] dark:bg-sky-500 dark:shadow-sky-500/25 dark:hover:bg-sky-600"
                    >
                        <LayoutDashboard className="size-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/my-bookings"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                    >
                        View my bookings
                        <ArrowRight className="size-3.5" />
                    </Link>
                </EmptyContent>
            </Empty>
        </div>
    );
};

export default DashboardPage;
