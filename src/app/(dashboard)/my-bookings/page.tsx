import React from "react";
import Link from "next/link";
import { CalendarClock, ArrowRight, Search } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

const MyBookingsPage = () => {
    return (
        <div className="px-4 py-10 sm:px-6 lg:px-10">
            <Empty className="border border-dashed border-gray-200 bg-white py-24 dark:border-white/10 dark:bg-[#131313]">
                <EmptyHeader>
                    <EmptyMedia>
                        <span className="flex size-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-600 shadow-sm dark:bg-sky-500/10 dark:text-sky-400">
                            <CalendarClock className="size-9" strokeWidth={1.5} />
                        </span>
                    </EmptyMedia>
                    <EmptyTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        No bookings yet
                    </EmptyTitle>
                    <EmptyDescription className="max-w-sm text-sm leading-6">
                        Your upcoming and past studio sessions will appear here once you make
                        your first booking. Discover verified creative spaces and book by
                        the hour — instant confirmation, no fuss.
                    </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <Link
                        id="browse-studios-from-bookings"
                        href="/#featured"
                        className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] dark:bg-sky-500 dark:shadow-sky-500/25 dark:hover:bg-sky-600"
                    >
                        <Search className="size-4" />
                        Browse Studios
                    </Link>
                    <Link
                        href="/#categories"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                    >
                        Explore categories
                        <ArrowRight className="size-3.5" />
                    </Link>
                </EmptyContent>
            </Empty>
        </div>
    );
};

export default MyBookingsPage;
