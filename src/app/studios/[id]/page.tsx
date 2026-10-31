import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";

const formatTitle = (slug: string) =>
    slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const StudioDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#131313]">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                <CalendarClock className="size-7" />
            </span>
            <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-sky-400">
                Studio details
            </p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatTitle(id)}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                The full studio page — gallery, amenities, availability calendar and
                booking — is coming soon.
            </p>
            <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B7F36B] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#a5e653]"
            >
                <ArrowLeft className="size-4" />
                Back to home
            </Link>
        </div>
    );
};

const StudioDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    return (
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-10">
            <Suspense
                fallback={
                    <div className="h-72 animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#131313]" />
                }
            >
                <StudioDetail params={params} />
            </Suspense>
        </div>
    );
};

export default StudioDetailPage;
