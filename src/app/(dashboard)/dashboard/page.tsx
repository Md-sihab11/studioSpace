import React from "react";
import Link from "next/link";
import { Construction } from "lucide-react";

const DashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#131313]">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-sky-500/10 dark:text-sky-400">
                <Construction className="size-7" />
            </span>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Host Dashboard
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                The dashboard for managing listings, bookings and payouts is coming
                soon. Explore the marketplace in the meantime.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-full bg-[#B7F36B] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#a5e653]"
            >
                Back to home
            </Link>
        </div>
    );
};

export default DashboardPage;
