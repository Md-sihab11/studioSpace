import type { Metadata } from "next";
import { Suspense } from "react";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/shared/navbar";
import Footer from "@/component/shared/footer";
import { Toaster } from "sonner";

const Josefin = Josefin_Sans({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "StudioSpace — Book Creative Studios by the Hour",
  description:
    "StudioSpace is the marketplace for creators to discover and book photo studios, film sets, podcast rooms and music suites by the hour — verified spaces, instant confirmation and host protection.",
};

/** Applies the persisted color theme before hydration to avoid a flash. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("studiospace_theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"

      className={`${Josefin.className} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Suspense
          fallback={
            <header className="sticky top-0 z-50 h-16 w-full border-b border-gray-200/80 bg-white/60 backdrop-blur-md md:h-[72px] dark:border-white/10 dark:bg-[#0a0a0a]/60" />
          }
        >
          <Navbar />
        </Suspense>
        <div className="flex flex-1 flex-col">{children}</div>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3500}
        />
        <Footer />
      </body>
    </html>
  );
}
