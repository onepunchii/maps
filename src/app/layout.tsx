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

import CompanyIntroSidebar from "@/components/layout/sidebars/CompanyIntroSidebar";
import ServiceBannerSidebar from "@/components/layout/sidebars/ServiceBannerSidebar";

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

                            {/* Left Banner (Company Info) */}
                            <CompanyIntroSidebar />

                            {/* Mobile Container (Centered) */}
                            <main className="w-full max-w-[512px] bg-bg-main h-[100dvh] shadow-2xl relative overflow-y-auto overflow-x-hidden border-x border-[#121212] z-10 scrollbar-hide">
                                {children}
                            </main>

                            {/* Right Banner (Service/Franchise) */}
                            <ServiceBannerSidebar />
                        </div>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
