"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dog, ArrowRight } from "lucide-react";

export default function MbtiIntroPage() {
    const router = useRouter();
    const [petName, setPetName] = useState<string>("두부");
    const [petImage, setPetImage] = useState<string | null>(null);

    useEffect(() => {
        // Determine pet from localStorage or default
        const storedName = localStorage.getItem("petName");
        const storedPhoto = localStorage.getItem("petPhoto");
        if (storedName) setPetName(storedName);
        if (storedPhoto) setPetImage(storedPhoto);
    }, []);

    const handleStart = () => {
        router.push("/mbti/test");
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col text-white relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-petudy-lime/5 blur-[100px] pointer-events-none" />

            {/* Navbar Placeholder */}
            <div className="h-14 flex items-center justify-between border-b border-[#333] relative z-10 bg-bg-main/50 backdrop-blur-md px-4">
                <button onClick={() => router.back()} className="p-1">
                    <ArrowRight className="w-6 h-6 rotate-180 text-white" />
                </button>
                <h1 className="font-bold text-lg absolute left-1/2 -translate-x-1/2">멍BTI 분석</h1>
                <div className="w-8" /> {/* Spacer for centering */}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 z-10 max-h-[calc(100vh-3.5rem)] overflow-y-auto">

                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
                        우리 {petName},<br />사실 <span className="text-petudy-lime">사람</span> 아닐까?
                    </h2>
                    <p className="text-gray-400 leading-relaxed font-light text-sm">
                        행동 분석을 통해 아이의 성향을 파악하고<br />
                        딱 맞는 <span className="text-white font-medium">맞춤 서비스</span>를 추천해드려요.
                    </p>
                </div>

                <div className="w-full max-w-xs space-y-3">
                    <div className="bg-bg-card p-4 rounded-2xl flex items-center gap-4 text-left border border-[#333] shadow-lg">
                        <span className="text-2xl bg-bg-input p-2 rounded-full">🔥</span>
                        <div>
                            <h3 className="font-bold text-sm text-white">파워 에너자이저</h3>
                            <p className="text-xs text-petudy-lime font-medium">지치지 않는 체력왕</p>
                        </div>
                    </div>
                    <div className="bg-bg-card p-4 rounded-2xl flex items-center gap-4 text-left border border-[#333] shadow-lg">
                        <span className="text-2xl bg-bg-input p-2 rounded-full">👑</span>
                        <div>
                            <h3 className="font-bold text-sm text-white">유리멘탈 공주님</h3>
                            <p className="text-xs text-petudy-lime font-medium">섬세한 케어 요망</p>
                        </div>
                    </div>
                </div>

                <div className="w-full pt-2">
                    <button
                        onClick={handleStart}
                        className="w-full bg-petudy-lime text-bg-main font-black text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] transition-all flex items-center justify-center gap-2 active:scale-[0.98] group"
                    >
                        검사 시작하기
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        결과는 <b className="text-gray-300">반려동물 등록증</b>에 뱃지로 기록됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
