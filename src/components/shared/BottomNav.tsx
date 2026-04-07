"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Only apply scroll behavior on the contest page on mobile
        if (pathname !== "/contest") {
            setIsVisible(true);
            return;
        }

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY ? "down" : "up";

            if (direction === "down" && currentScrollY > 10 && (window.innerHeight + currentScrollY) < document.body.offsetHeight) {
                setIsVisible(false);
            } else if (direction === "up" || currentScrollY < 10) {
                setIsVisible(true);
            }

            lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);


    // Hide BottomNav on booking new page and MBTI pages and intro pages
    if (pathname.startsWith("/booking/new") || pathname.startsWith("/mbti") || pathname.startsWith("/intro")) return null;

    const tabs = [
        { name: "홈", href: "/", icon: Home },
        { name: "펫픽", href: "/community/petpick", icon: Sparkles },
        { name: "콘테스트", href: "/contest", icon: Trophy },
        { name: "예약하기", href: "/booking", icon: Calendar },
        { name: "내 정보", href: "/mypage", icon: User },
    ];

    return (
        <>
            {/* 1. Mobile Bottom Bar (Hidden on Large Screens) */}
            <nav
                className={cn(
                    "lg:hidden fixed bottom-6 left-3 right-3 z-50 bg-bg-card/90 backdrop-blur-md rounded-3xl border border-[#333] shadow-2xl p-2 px-4 transition-transform duration-300",
                    !isVisible && "translate-y-[200%]"
                )}
            >
                <div className="flex justify-between items-center h-14 max-w-[480px] mx-auto w-full">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative",
                                    isActive ? "text-petudy-lime scale-105" : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                {/* Neon Glow for Active State */}
                                {isActive && (
                                    <div className="absolute -top-1 w-8 h-8 bg-petudy-lime rounded-full blur-[15px] opacity-20 pointer-events-none"></div>
                                )}

                                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                                <span className="text-[10px] font-medium relative z-10">{tab.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* 2. Desktop Bottom Bar (Same as Mobile) */}
            <nav className="hidden lg:flex fixed bottom-6 left-0 right-0 z-50 justify-center">
                <div className="w-full max-w-[512px] bg-bg-card/90 backdrop-blur-md rounded-3xl border border-[#333] shadow-2xl p-2 px-4">
                    <div className="flex justify-between items-center h-14 mx-auto w-full">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative",
                                        isActive ? "text-petudy-lime scale-105" : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute -top-1 w-8 h-8 bg-petudy-lime rounded-full blur-[15px] opacity-20 pointer-events-none"></div>
                                    )}

                                    <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                                    <span className="text-[10px] font-medium relative z-10">{tab.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </>
    );
}
