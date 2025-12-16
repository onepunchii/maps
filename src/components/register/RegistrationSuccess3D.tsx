"use client";

import React, { useEffect, useState } from "react";
import { Home, Download, X } from "lucide-react";

interface RegistrationFormData {
    name: string;
    breed?: string;
    birth?: Date | string;
    photo?: File | string | null;
    gender?: "male" | "female" | string;
    neuter?: boolean | string;
    color?: string;
    registrationNumber?: string;
    species?: string;
}

interface RegistrationSuccess3DProps {
    onComplete: () => void;
    formData: RegistrationFormData;
    viewMode?: boolean;
}

export default function RegistrationSuccess3D({ onComplete, formData, viewMode = false }: RegistrationSuccess3DProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!viewMode) {
            const timer = setTimeout(() => setShowPopup(true), 500);
            const hideTimer = setTimeout(() => setShowPopup(false), 3000);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [viewMode]);

    // Construct API URL
    const getOgImageUrl = () => {
        const params = new URLSearchParams();
        params.append("name", formData.name || "이름");
        params.append("breed", formData.breed || "품종 미상");
        params.append("regNum", formData.registrationNumber || "미등록");

        // Handle Photo URL
        // If it's a File (shouldn't be in this new flow), we can't pass it.
        // If it's a string, pass it.
        if (typeof formData.photo === "string" && formData.photo.startsWith("http")) {
            params.append("photo", formData.photo);
        }

        return `/api/og/pet-pass?${params.toString()}`;
    };

    const ogImageUrl = getOgImageUrl();

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(ogImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `petudy-pass-${formData.name || "pet"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            alert("이미지 저장에 실패했습니다.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-bg-main flex flex-col items-center justify-center font-sans pb-10 overflow-hidden touch-none h-dvh w-screen">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-petudy-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            {/* Success Popup (Only in Registration Flow) */}
            {!viewMode && (
                <div
                    className={`fixed top-1/4 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 transform ${showPopup ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"}`}
                >
                    <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-white/20 flex items-center gap-3">
                        <div className="w-8 h-8 bg-petudy-lime rounded-full flex items-center justify-center text-lg shadow-sm animate-bounce">
                            🎉
                        </div>
                        <span className="text-gray-900 font-black text-lg tracking-tight">완료!!</span>
                    </div>
                </div>
            )}

            {/* Lanyard Strap Animation - V-Shape */}
            <div className={`absolute top-[-60px] flex flex-col items-center z-40 ${!viewMode ? "animate-slide-in-down" : ""}`}>
                <div className="relative w-full flex justify-center -mt-10">
                    <div className="w-5 h-[220px] bg-[#222] absolute top-[-100px] left-[50%] -translate-x-[12px] -rotate-[12deg] origin-bottom rounded-full shadow-lg z-0 border-x border-[#333]"></div>
                    <div className="w-5 h-[220px] bg-[#222] absolute top-[-100px] right-[50%] translate-x-[12px] rotate-[12deg] origin-bottom rounded-full shadow-lg z-0 border-x border-[#333]"></div>
                </div>
                <div className="relative mt-20 z-50 flex flex-col items-center">
                    <div className="w-12 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md shadow-lg border border-gray-600 z-10 flex items-center justify-center">
                        <div className="w-8 h-1 bg-white/20 rounded-full blur-[0.5px]"></div>
                    </div>
                    <div className="w-8 h-12 bg-gradient-to-b from-gray-500 to-gray-700 rounded-b-xl border border-gray-600 shadow-[0_4px_6px_rgba(0,0,0,0.5)] -mt-2 z-20 flex justify-center items-center">
                        <div className="w-2 h-6 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Pass Card Container (3D Swing) */}
            <div
                className={`relative z-30 -mt-8 w-[380px] bg-transparent flex flex-col origin-top ${!viewMode ? "animate-swing" : ""}`}
            >
                {/* Generated Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={ogImageUrl}
                    alt="Petudy Pass"
                    className="w-full h-auto rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#333]"
                />

                {/* Download Button (Overlay) */}
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="absolute top-5 right-5 w-8 h-8 bg-[#333]/80 hover:bg-[#333] backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-petudy-lime transition-all shadow-md z-50 border border-white/5 active:scale-95"
                    title="이미지로 저장"
                >
                    {isDownloading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                </button>
            </div>

            {/* Bottom Controls */}
            <div className="fixed bottom-10 left-0 right-0 flex justify-center z-50 px-6 gap-3">
                {viewMode ? (
                    <button
                        onClick={onComplete}
                        className="w-14 h-14 bg-[#333]/80 hover:bg-[#444] backdrop-blur-md rounded-full border border-white/10 shadow-lg flex items-center justify-center text-white active:scale-95 transition-all"
                        title="닫기"
                    >
                        <X className="w-6 h-6" />
                    </button>
                ) : (
                    <button
                        onClick={onComplete}
                        className="bg-petudy-lime text-bg-main font-bold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(163,223,70,0.5)] hover:bg-petudy-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        <span>홈으로 가기</span>
                    </button>
                )}
            </div>
        </div>
    );
}
