import React from "react";
import Link from "next/link";
import { LayoutGrid, Plus, ArrowRight } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

const MyListingsPage = () => {
    return (
        <div className="px-4 py-10 sm:px-6 lg:px-10">
            <Empty className="border border-dashed border-gray-200 bg-white py-24 dark:border-white/10 dark:bg-[#131313]">
                <EmptyHeader>
                    <EmptyMedia>
                        <span className="flex size-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-600 shadow-sm dark:bg-sky-500/10 dark:text-sky-400">
                            <LayoutGrid className="size-9" strokeWidth={1.5} />
                        </span>
                    </EmptyMedia>
                    <EmptyTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        No listings yet
                    </EmptyTitle>
                    <EmptyDescription className="max-w-sm text-sm leading-6">
                        Studios you list as a host will appear here. Manage photos, set
                        your pricing and availability, and start earning from your space —
                        all in one place.
                    </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <Link
                        id="add-studio-from-listings"
                        href="/add-studio"
                        className="inline-flex items-center gap-2 rounded-full bg-[#B7F36B] px-6 py-2.5 text-sm font-semibold text-black shadow-md shadow-lime-500/20 transition-all duration-200 hover:bg-[#a5e653] hover:shadow-lg active:scale-[0.98]"
                    >
                        <Plus className="size-4" />
                        List Your Studio
                    </Link>
                    <Link
                        href="/#trust"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-sky-400"
                    >
                        Learn about hosting
                        <ArrowRight className="size-3.5" />
                    </Link>
                </EmptyContent>
            </Empty>
        </div>
    );
};

export default MyListingsPage;
