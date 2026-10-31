import { Suspense } from "react";

import HeroSlider from "@/component/home/HeroSlider";
import FeaturedStudios from "@/component/home/FeaturedStudios";
import Categories from "@/component/home/Categories";
import HowItWorks from "@/component/home/HowItWorks";
import HostGuarantee from "@/component/home/HostGuarantee";
import About from "@/component/home/About";

export default function Home() {
    return (
        <main className="flex-1">
            {/* The hero uses Swiper (new Date() in its modules), so it streams in after prerender. */}
            <Suspense fallback={<div className="h-[92svh] max-h-[860px] min-h-[600px] w-full bg-[#1a1c23]" />}>
                <HeroSlider />
            </Suspense>
            <FeaturedStudios />
            <Categories />
            <HowItWorks />
            <HostGuarantee />
            <About />
        </main>
    );
}
