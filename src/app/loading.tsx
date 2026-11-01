
import React from "react";
import { Aperture, Camera, Film, Mic } from "lucide-react";

const Loading = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-5 dark:bg-[#0d0d0d]">
            <div className="relative flex h-56 w-64 items-center justify-center">
                <div className="absolute size-44 rounded-full bg-lime-400/10 blur-3xl" />

                <div className="absolute size-48 animate-spin rounded-full border border-dashed border-lime-500/30" />

                <div className="relative z-10 flex size-28 items-center justify-center rounded-[2rem] bg-[#B7F36B] shadow-xl shadow-lime-500/20">
                    <Camera className="size-14 text-black" strokeWidth={1.5} />
                </div>

                <div className="absolute left-3 top-8 flex size-11 animate-bounce items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                    <Film className="size-5 text-lime-600 dark:text-lime-400" />
                </div>

                <div className="absolute right-3 top-10 flex size-11 animate-pulse items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                    <Mic className="size-5 text-lime-600 dark:text-lime-400" />
                </div>

                <div className="absolute bottom-2 left-12 flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a1a1a]">
                    <Aperture className="size-5 text-lime-600 dark:text-lime-400" />
                </div>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Studio<span className="text-[#8CC63E]">Space</span>
            </h1>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Setting up your creative space...
            </p>

            <div className="mt-8 h-1.5 w-52 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#B7F36B]" />
            </div>

            <p className="mt-4 text-xs font-medium tracking-widest text-gray-400 uppercase">
                Creating possibilities
            </p>
        </main>
    );
};

export default Loading;
