"use client";

import React, { useState, Suspense } from "react";
import { X, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Galaxy from "@/components/ui/Galaxy";

// Service definitions
const SERVICES: Record<string, { title: string; icon: string }> = {
    "TAXI": { title: "펫택시", icon: "🚕" },
    "FUNERAL": { title: "모빌리티 장례", icon: "🕊️" },
    "BATH": { title: "모빌리티 목욕", icon: "🛁" },
    "CHECKUP": { title: "모빌리티 검진", icon: "🩺" },
    "INSURANCE": { title: "펫보험", icon: "🛡️" },
    "MUTUAL_AID": { title: "펫상조", icon: "🌺" },
    "TRAVEL": { title: "펫여행", icon: "✈️" },
};

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "TAXI"; // Default to TAXI if not specified
    const service = SERVICES[category] || SERVICES["TAXI"];
    const isFuneral = category === "FUNERAL";

    const [selectedDate, setSelectedDate] = useState<number>(17); // Default to a date
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Mock Date Data (November style from image)
    const dates = [
        { day: "오늘", date: 14, disabled: true },
        { day: "내일", date: 15, disabled: true },
        { day: "목", date: 16, disabled: false },
        { day: "금", date: 17, disabled: false },
        { day: "토", date: 18, disabled: false, isWeekend: true },
        { day: "일", date: 19, disabled: false },
        { day: "월", date: 20, disabled: false },
    ];

    // Mock Time Data
    const morningSlots = ["10:00", "10:30", "11:00", "11:30"];
    const afternoonSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
    const allTimeSlots = [...morningSlots, ...afternoonSlots];

    return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-bg-main text-white">
            {/* Force background color on html/body to prevent white gap during overscroll */}
            <style jsx global>{`
                body {
                    background-color: #121212;
                }
            `}</style>

            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-petudy-lime rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

            {/* Galaxy Background for Funeral */}
            {isFuneral && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <Galaxy
                        mouseInteraction={true}
                        mouseRepulsion={true}
                        density={1.9}
                        glowIntensity={0.2}
                        saturation={0}
                        hueShift={0}
                        twinkleIntensity={0.7}
                        rotationSpeed={0}
                        repulsionStrength={0}
                        autoCenterRepulsion={0}
                        starSpeed={0.2}
                        speed={0.4}
                        transparent={true}
                    />
                </div>
            )}

            {/* Header */}
            <header className="px-4 py-3 flex items-center sticky top-0 z-30">
                <Link href="/">
                    <ChevronLeft className="w-7 h-7 text-white" />
                </Link>
            </header>

            <main className="px-6 flex-1 overflow-hidden relative z-10 pt-2 pb-28">

                {/* Title */}
                <div className="flex items-center gap-2 mt-[50px] mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-petudy-lime leading-tight">
                        언제 방문 드릴까요?
                    </h1>
                    <Image
                        src="/images/rocket-3d.png"
                        alt="Rocket"
                        width={40}
                        height={40}
                        className="object-contain animate-bounce"
                    />
                </div>

                {/* Date Picker Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-bold text-white">날짜 선택</span>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="flex gap-3 overflow-x-auto pb-6 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {dates.map((item) => (
                            <button
                                key={item.date}
                                disabled={item.disabled}
                                onClick={() => setSelectedDate(item.date)}
                                className={`
                                    flex flex-col items-center justify-center min-w-[64px] h-[76px] rounded-[20px] border transition-all z-20 relative shrink-0
                                    ${item.disabled
                                        ? "opacity-30 cursor-not-allowed bg-[#1A1A1A] border-[#333]"
                                        : "cursor-pointer"}
                                    ${selectedDate === item.date
                                        ? "bg-petudy-lime border-petudy-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] scale-105"
                                        : "bg-[#2C2C2E] border-[#333] hover:border-gray-500 text-gray-300"
                                    }
                                `}
                            >
                                <span className={`text-xs mb-1 ${selectedDate === item.date ? "text-bg-main/70 font-bold" :
                                    item.isWeekend ? "text-orange-400" : "text-gray-500"
                                    }`}>
                                    {item.day}
                                </span>
                                <span className={`text-xl font-black ${selectedDate === item.date ? "text-bg-main" : "text-white"
                                    }`}>
                                    {item.date}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Slots Section */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-bold text-white">시간 선택</span>
                    </div>

                    {/* Morning */}
                    <div className="mb-4">
                        <h3 className="text-xs font-bold mb-2 text-gray-400 px-1">오전</h3>
                        {/* Reduced padding to compact layout */}
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {morningSlots.map((time) => (
                                <TimeSlot
                                    key={time}
                                    time={time}
                                    selected={selectedTime === time}
                                    onClick={() => setSelectedTime(time)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Afternoon */}
                    <div>
                        <h3 className="text-xs font-bold mb-2 text-gray-400 px-1">오후</h3>
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {afternoonSlots.map((time) => (
                                <TimeSlot
                                    key={time}
                                    time={time}
                                    selected={selectedTime === time}
                                    onClick={() => setSelectedTime(time)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-20">
                <div className="w-full max-w-[430px]">
                    <button
                        disabled={!selectedTime}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedTime
                            ? "bg-petudy-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] active:scale-[0.98]"
                            : "bg-[#2C2C2E] text-gray-600 border border-[#333] cursor-not-allowed"
                            }`}
                    >
                        {service.title} 예약하기
                    </button>
                </div>
            </div>
        </div>
    );
}

function TimeSlot({ time, selected, onClick }: { time: string, selected: boolean, onClick: () => void }) {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour > 12 ? hour - 12 : hour;

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center min-w-[64px] h-[76px] rounded-[20px] border transition-all relative z-20 shrink-0
                ${selected
                    ? "bg-petudy-lime border-petudy-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] font-bold scale-105"
                    : "bg-[#2C2C2E] border-[#333] text-gray-300 hover:bg-[#3A3A3D] hover:border-gray-500"
                }
            `}
        >
            <span className={`text-xs mb-1 ${selected ? "text-bg-main/70 font-bold" : "text-gray-500"}`}>
                {period}
            </span>
            <span className={`text-lg font-bold ${selected ? "text-bg-main" : "text-white"}`}>
                {displayHour}:{minute.toString().padStart(2, '0')}
            </span>
        </button>
    );
}
