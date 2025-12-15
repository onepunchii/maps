"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PetPassCard, MbtiType } from "@/components/shared/PetPassCard";
import { Share2, CheckCircle } from "lucide-react";

function MbtiResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = (searchParams.get("type") as MbtiType) || "SOCIAL";

    const [petName, setPetName] = useState("두부");
    const [petImage, setPetImage] = useState("https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?q=80&w=800&auto=format&fit=crop");

    useEffect(() => {
        // Load pet info
        const storedName = localStorage.getItem("petName");
        const storedPhoto = localStorage.getItem("petPhoto");
        if (storedName) setPetName(storedName);
        if (storedPhoto) setPetImage(storedPhoto);

        // Confetti effect could go here
    }, []);

    const handleApplyBadge = () => {
        // Simulate API call to save result
        localStorage.setItem("petMbtiType", type);
        alert("뱃지가 반려동물 등록증에 적용되었습니다!");
        router.push("/");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '멍BTI 결과',
                text: `우리 ${petName}의 성격 유형은?`,
                url: window.location.href,
            });
        } else {
            alert("링크가 복사되었습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col pb-10 text-white relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-petudy-lime/5 blur-[120px] pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">분석 완료!</h2>
                    <p className="text-gray-400 font-light">
                        우리 아이에게 딱 맞는 <span className="text-petudy-lime font-bold">뱃지</span>가 발급되었어요.
                    </p>
                </div>

                {/* Card Display */}
                <div className="w-full transform transition-all duration-700 hover:scale-105 shadow-2xl">
                    <PetPassCard
                        petName={petName}
                        petImage={petImage}
                        registrationNumber="PT-2024-00123"
                        mbtiType={type}
                    />
                </div>

                {/* Actions */}
                <div className="w-full space-y-3 max-w-sm">
                    <button
                        onClick={handleApplyBadge}
                        className="w-full bg-petudy-lime text-bg-main font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(163,223,70,0.3)] hover:bg-[#bbf080] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <CheckCircle className="w-5 h-5" />
                        반려동물 등록증에 뱃지 달기
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-full bg-bg-card text-gray-300 font-bold py-4 rounded-xl border border-[#333] hover:bg-[#252527] transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-5 h-5" />
                        결과 공유하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MbtiResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-main" />}>
            <MbtiResultContent />
        </Suspense>
    );
}
