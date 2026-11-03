
import React from "react";
import Link from "next/link";
import {
    Aperture,
    ArrowLeft,
    Camera,
    Film,
    Lightbulb,
    SearchX,
} from "lucide-react";

const NotFound = () => {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-16 dark:bg-[#0d0d0d]">
            {/* Background Decorations */}
            <div className="pointer-events-none absolute -left-32 top-10 size-80 rounded-full bg-lime-400/10 blur-[100px]" />
            <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-lime-400/10 blur-[100px]" />

            <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
                {/* Studio Illustration */}
                <div className="relative mx-auto mb-10 flex h-64 max-w-sm items-center justify-center">
                    <div className="absolute size-52 rounded-full border border-dashed border-lime-500/40" />
                    <div className="absolute size-40 rounded-full bg-lime-400/10" />

                    <div className="relative flex size-32 items-center justify-center rounded-[2rem] bg-[#B7F36B] shadow-2xl shadow-lime-500/20">
                        <Camera className="size-16 text-black" strokeWidth={1.5} />

                        <span className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-xl bg-white shadow-lg dark:bg-[#222]">
                            <SearchX className="size-5 text-red-500" />
                        </span>
                    </div>

                    <div className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                        <Film className="size-6 text-lime-600 dark:text-lime-400" />
                    </div>

                    <div className="absolute right-5 top-8 flex size-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                        <Lightbulb className="size-6 text-lime-600 dark:text-lime-400" />
                    </div>

                    <div className="absolute bottom-4 left-12 flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                        <Aperture className="size-5 text-lime-600 dark:text-lime-400" />
                    </div>
                </div>

                {/* Error Content */}
                <p className="text-sm font-bold tracking-[0.35em] text-lime-600 uppercase dark:text-lime-400">
                    Error 404
                </p>

                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                    Oops! This Studio
                    <span className="block text-lime-500">
                        Doesn&apos;t Exist.
                    </span>
                </h1>

                <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-gray-600 dark:text-gray-400">
                    Looks like you&apos;ve wandered into an empty studio.
                    The page you&apos;re looking for may have been moved,
                    deleted, or never existed.
                </p>

                {/* Return Home */}
                <Link
                    href="/"
                    className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm font-bold shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl"
                >
                    <ArrowLeft className="size-5" />
                    Return to Home
                </Link>

                {/* Footer */}
                <div className="mt-14 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-600">
                    <Aperture className="size-4" />
                    <span>
                        StudioSpace © 2026. Create something amazing.
                    </span>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
