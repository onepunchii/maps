import type { Metadata, Viewport } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Petudy 2.0",
    description: "반려동물 모빌리티 플랫폼",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className="antialiased bg-[#121212] flex justify-center min-h-screen font-sans overflow-hidden"
            >
                <QueryProvider>
                    <AuthProvider>
                        {/* Desktop/Fold Layout Wrapper */}
                        <div className="relative flex w-full h-full justify-center">

                            {/* Left Banner Placeholder (Hidden on mobile, Visible on Desktop) */}
                            <aside className="hidden lg:flex flex-col justify-center items-end w-full max-w-[calc(50%-256px)] h-full fixed left-0 top-0 p-8 z-0">
                                {/* Placeholder Content for Left Banner */}
                                <div className="text-zinc-700 font-bold text-4xl opacity-20 select-none">
                                    PETUDY
                                </div>
                            </aside>

                            {/* Mobile Container (Centered) */}
                            <main className="w-full max-w-[512px] bg-bg-main h-[100dvh] shadow-2xl relative overflow-y-auto overflow-x-hidden border-x border-[#121212] z-10 scrollbar-hide">
                                {children}
                            </main>

                            {/* Right Banner Placeholder (Hidden on mobile, Visible on Desktop) */}
                            <aside className="hidden lg:flex flex-col justify-center items-start w-full max-w-[calc(50%-256px)] h-full fixed right-0 top-0 p-8 z-0">
                                {/* Placeholder Content for Right Banner */}
                                <div className="text-zinc-700 font-bold text-4xl opacity-20 select-none">
                                    2.0
                                </div>
                            </aside>
                        </div>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
