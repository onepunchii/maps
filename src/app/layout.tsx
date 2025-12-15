import type { Metadata, Viewport } from "next";
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className="antialiased bg-black flex justify-center min-h-screen font-sans"
            >
                {/* Mobile Container */}
                <main className="w-full max-w-[430px] bg-bg-main min-h-screen shadow-2xl relative overflow-x-hidden border-x border-[#121212]">
                    {children}
                </main>
            </body>
        </html>
    );
}
