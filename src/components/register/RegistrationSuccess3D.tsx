"use client";

import React, { useEffect, useRef, useState } from "react";
import { Home, Download, X } from "lucide-react";
import { ALL_PET_BREEDS } from "@/data/petData";
import { QRCodeCanvas } from "qrcode.react";
import PetCharacteristicBars from "./PetCharacteristicBars";

interface RegistrationFormData {
    name: string;
    breed?: string;
    birth?: Date | string;
    photo?: File | string | null;
    gender?: "male" | "female" | string;
    neuter?: boolean | string; // In wizard it might be string "yes"/"no", checking implementation
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
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Only show success popup in registration flow, not in view mode
        if (!viewMode) {
            // slight delay before showing popup
            const timer = setTimeout(() => setShowPopup(true), 500);
            // hide after 2.5s
            const hideTimer = setTimeout(() => setShowPopup(false), 3000);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [viewMode]);

    // Helper to format date
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "-";
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    };

    const isMale = formData.gender === "male" || formData.gender === "MALE";
    const genderText = isMale ? "수컷 (Male)" : "암컷 (Female)";

    // Handle both boolean (from DB) and string "yes"/"no" (from Wizard form)
    const isNeutered = formData.neuter === true || formData.neuter === "yes" || formData.neuter === "Y";
    const neuterText = isNeutered ? "완료 (Yes)" : "미완료 (No)";
    const colorText = formData.color || "모색 없음";

    // Removed photoUrl state and useEffect as the img src can handle it directly.

    const regNumDisplay = formData.registrationNumber ? `${formData.registrationNumber} ` : "(미등록)";
    const qrData = `Petudy - Reg:${formData.registrationNumber || "Unregistered"} -${formData.name} `;

    // Find breed data for stats and description
    const breedData = ALL_PET_BREEDS.find(b =>
        b.name === formData.breed &&
        (formData.species ? b.species === formData.species : true)
    );

    const handleHomeClick = () => {
        // Save name
        localStorage.setItem("petName", formData.name || "반려동물");

        if (formData.photo) {
            if (formData.photo instanceof File) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    localStorage.setItem("petPhoto", base64String);
                    onComplete();
                };
                reader.readAsDataURL(formData.photo);
            } else if (typeof formData.photo === "string") {
                localStorage.setItem("petPhoto", formData.photo);
                onComplete();
            } else {
                onComplete();
            }
        } else {
            onComplete();
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);

        try {
            // Dynamic import to prevent SSR/Load issues
            const html2canvas = (await import("html2canvas")).default;

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null, // Transparent background
                scale: 2, // Higher resolution
                useCORS: true, // For images
            });

            const link = document.createElement("a");
            link.download = `petudy-card-${formData.name || "pet"}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
            alert("저장에 실패했습니다. 다시 시도해주세요.");
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

            {/* Lanyard Strap Animation - V-Shape (Corrected) */}
            <div className={`absolute top-[-60px] flex flex-col items-center z-40 ${!viewMode ? "animate-slide-in-down" : ""}`}>
                {/* Strap V-Shape */}
                <div className="relative w-full flex justify-center -mt-10">
                    {/* Left Strap (\) - Top leans left */}
                    <div className="w-5 h-[220px] bg-[#222] absolute top-[-100px] left-[50%] -translate-x-[12px] -rotate-[12deg] origin-bottom rounded-full shadow-lg z-0 border-x border-[#333]"></div>
                    {/* Right Strap (/) - Top leans right */}
                    <div className="w-5 h-[220px] bg-[#222] absolute top-[-100px] right-[50%] translate-x-[12px] rotate-[12deg] origin-bottom rounded-full shadow-lg z-0 border-x border-[#333]"></div>
                </div>

                {/* Metal Clip Mechanism */}
                <div className="relative mt-20 z-50 flex flex-col items-center">
                    {/* Top Ring/Holder where strap enters */}
                    <div className="w-12 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md shadow-lg border border-gray-600 z-10 flex items-center justify-center">
                        <div className="w-8 h-1 bg-white/20 rounded-full blur-[0.5px]"></div>
                    </div>

                    {/* Clip Body connecting to card */}
                    <div className="w-8 h-12 bg-gradient-to-b from-gray-500 to-gray-700 rounded-b-xl border border-gray-600 shadow-[0_4px_6px_rgba(0,0,0,0.5)] -mt-2 z-20 flex justify-center items-center">
                        {/* Clip Detail */}
                        <div className="w-2 h-6 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Pass Card Container */}
            <div
                ref={cardRef}
                className={`relative z-30 -mt-8 w-[380px] bg-bg-card rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col origin-top border border-[#333] ${!viewMode ? "animate-swing" : ""}`}
            >

                {/* Card Hole */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#121212] rounded-full shadow-inner z-40 flex items-center justify-center border border-[#333]">
                    <div className="w-10 h-1.5 bg-white/10 rounded-full"></div>
                </div>

                {/* Hologram Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
                    <div className="absolute inset-[-50%] w-[200%] h-[200%] flex flex-wrap content-center justify-center gap-8 -rotate-12 transform scale-125">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <span key={i} className="text-xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 tracking-widest select-none blur-[0.5px]">
                                Petudy
                            </span>
                        ))}
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-10 flex flex-col h-full min-h-[600px] relative z-10">

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <span className="inline-block px-2 py-0.5 bg-petudy-lime/20 text-petudy-lime text-[10px] font-bold rounded mb-1.5 border border-petudy-lime/30">
                                소유자
                            </span>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-2xl font-black text-white tracking-tight">
                                    {formData.name || "이름"}
                                </h1>
                                {/* Pet Photo Avatar */}
                                {formData.photo ? (
                                    <div className="w-10 h-10 rounded-full border-[2px] border-[#333] shadow-md overflow-hidden relative">
                                        <img src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)} alt="Pet" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-xl shadow-sm border border-[#444]">
                                        🐶
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-500 text-[9px] font-mono mt-1.5 tracking-tight">
                                등록번호 <span className="text-gray-300 font-bold">{regNumDisplay}</span>
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="w-[60px] h-[60px] bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex items-center justify-center">
                            <QRCodeCanvas
                                value={qrData}
                                size={52}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                                marginSize={0}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-dashed bg-[#333] mb-4 font-bold"></div>

                    {/* Breed Description (Moved Top) */}
                    {breedData && (
                        <div className="mb-5 bg-[#333]/30 p-3 rounded-xl border border-[#333]">
                            <p className="text-gray-300 text-[11px] leading-relaxed break-keep text-center">
                                &quot;{breedData.description}&quot;
                            </p>
                        </div>
                    )}

                    {/* Details List */}
                    <div className="space-y-1.5 flex-1">
                        <div className="flex justify-between items-center group border-b border-[#333] pb-0.5">
                            <span className="text-gray-500 font-bold text-[11px]">생일</span>
                            <span className="text-gray-300 font-bold text-[11px] group-hover:text-petudy-lime transition-colors">
                                {formatDate(formData.birth)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center group border-b border-[#333] pb-0.5">
                            <span className="text-gray-500 font-bold text-[11px]">품종</span>
                            <span className="text-gray-300 font-bold text-[11px] group-hover:text-petudy-lime transition-colors">
                                {formData.breed || "믹스"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center group border-b border-[#333] pb-0.5">
                            <span className="text-gray-500 font-bold text-[11px]">색상</span>
                            <span className="text-gray-300 font-bold text-[11px] group-hover:text-petudy-lime transition-colors">
                                {colorText}
                            </span>
                        </div>
                        <div className="flex justify-between items-center group border-b border-[#333] pb-0.5">
                            <span className="text-gray-500 font-bold text-[11px]">성별</span>
                            <span className="text-gray-300 font-bold text-[11px] group-hover:text-petudy-lime transition-colors">
                                {genderText}
                            </span>
                        </div>
                        <div className="flex justify-between items-center group border-b border-[#333] pb-0.5">
                            <span className="text-gray-500 font-bold text-[11px]">중성화</span>
                            <span className="text-gray-300 font-bold text-[11px] group-hover:text-petudy-lime transition-colors">
                                {neuterText}
                            </span>
                        </div>
                    </div>

                    {/* Breed Characteristics Section (Bars Only) */}
                    {breedData && (
                        <div className="mt-2 pt-2 border-t border-dashed border-[#333]">
                            <PetCharacteristicBars traits={breedData.traits} />
                        </div>
                    )}
                </div>

                {/* Download Button (Icon Only, inside card) */}
                <button
                    onClick={handleDownload}
                    data-html2canvas-ignore="true"
                    disabled={isDownloading}
                    className="absolute top-5 right-5 w-8 h-8 bg-[#333]/80 hover:bg-[#333] backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-petudy-lime transition-all shadow-md z-50 border border-white/5 active:scale-95"
                    title="이미지로 저장"
                >
                    <Download className="w-4 h-4" />
                </button>
            </div>

            {/* Bottom Controls (Switch based on ViewMode) */}
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
                    <>
                        <button
                            onClick={handleHomeClick}
                            className="bg-petudy-lime text-bg-main font-bold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(163,223,70,0.5)] hover:bg-petudy-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>홈으로 가기</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
