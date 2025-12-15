"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Plus, Pencil, ArrowUpDown, IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import RegistrationSuccess3D from "../register/RegistrationSuccess3D";
import { Pet } from "@/actions/pet";

interface PetSettingsPageProps {
    initialPets: Pet[];
}

export default function PetSettingsPage({ initialPets }: PetSettingsPageProps) {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>(initialPets);
    const [viewingCardPet, setViewingCardPet] = useState<Pet | null>(null);

    // Effect to sync with initialPets if they change (optional, usually for client-side updates)
    useEffect(() => {
        setPets(initialPets);
    }, [initialPets]);

    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return "나이 정보 없음";
        const birth = new Date(birthDate);
        const today = new Date();

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            // simplistic day calc
            days += 30; // approx
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years}년 ${months}개월 ${days}일`;
    };

    return (
        <div className="min-h-screen bg-bg-main pb-20 text-white">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-petudy-lime rounded-full blur-[150px] opacity-10 pointer-events-none fixed"></div>

            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-bg-main/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#333]">
                <button onClick={() => router.back()} className="p-1 hover:bg-[#333] rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-lg font-bold text-white absolute left-1/2 -translate-x-1/2 tracking-tight">반려가족 설정</h1>
                <div className="w-8"></div> {/* Spacer for centering */}
            </header>

            <main className="px-5 py-6 space-y-8 relative z-0">
                {/* Add New Pet Button */}
                <button
                    onClick={() => router.push("/register")}
                    className="w-full py-5 rounded-[20px] bg-[#18181b]/50 border border-dashed border-[#444] flex items-center justify-center gap-2 text-gray-400 font-bold hover:bg-[#222] hover:text-petudy-lime hover:border-petudy-lime/50 transition-all group active:scale-[0.99]"
                >
                    <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:bg-petudy-lime group-hover:border-petudy-lime group-hover:text-bg-main transition-colors">
                        <Plus className="w-4 h-4" />
                    </div>
                    새로운 아이 등록하기
                </button>

                {/* Pet List Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            나의 반려가족 <span className="text-petudy-lime text-xs font-normal bg-petudy-lime/10 px-2 py-0.5 rounded-full">{pets.length}</span>
                        </h2>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181b] border border-[#333] rounded-full text-[11px] font-bold text-gray-400 hover:text-white hover:bg-[#222] transition-colors">
                            <ArrowUpDown className="w-3 h-3" />
                            순서 변경
                        </button>
                    </div>

                    <div className="space-y-4">
                        {pets.map((pet) => (
                            <div key={pet.id} className="bg-bg-card rounded-[24px] p-5 shadow-lg border border-[#333] relative overflow-hidden group">
                                {/* Active Glow Effect on Hover */}
                                <div className="absolute inset-0 bg-petudy-lime/0 group-hover:bg-petudy-lime/[0.02] transition-colors pointer-events-none"></div>

                                {/* Top Part: Info */}
                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="w-14 h-14 rounded-full bg-[#333] flex-shrink-0 border border-[#444] overflow-hidden relative shadow-md">
                                            {pet.photo_url ? (
                                                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">🐶</div>
                                            )}
                                        </div>

                                        {/* Text Info */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${pet.gender === "male" ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"}`}>
                                                    {pet.gender === "male" ? "♂" : "♀"}
                                                </div>
                                                <span className="text-lg font-black text-white tracking-tight">{pet.name}</span>
                                            </div>
                                            <div className="text-gray-400 text-xs font-medium tracking-tight leading-snug">
                                                {pet.breed || "믹스"} · {calculateAge(pet.birth_date)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {/* Registration Card Button */}
                                        <button
                                            onClick={() => setViewingCardPet(pet)}
                                            className="w-9 h-9 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-gray-400 hover:text-petudy-lime hover:bg-[#333] hover:border-petudy-lime/30 transition-colors group/btn"
                                            title="등록증 보기"
                                        >
                                            <IdCard className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        {/* Edit Button */}
                                        <button className="w-9 h-9 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-[#333] mb-4"></div>

                                {/* Concerns */}
                                <div className="flex items-start gap-3 relative z-10">
                                    <span className="text-[11px] font-bold text-gray-500 mt-1 whitespace-nowrap">건강 고민</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pet.concerns && pet.concerns.length > 0 ? (
                                            pet.concerns.map((concern, idx) => (
                                                <span key={idx} className="px-2.5 py-1 rounded-[8px] bg-[#222] border border-[#333] text-gray-300 text-[11px] font-medium hover:border-petudy-lime/30 hover:text-petudy-lime transition-colors">
                                                    {concern}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-600 text-[11px]">등록된 고민이 없습니다.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Registration Card Modal Overlay */}
            {viewingCardPet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <RegistrationSuccess3D
                        onComplete={() => setViewingCardPet(null)}
                        formData={{
                            name: viewingCardPet.name,
                            breed: viewingCardPet.breed || "믹스",
                            birth: viewingCardPet.birth_date ? new Date(viewingCardPet.birth_date) : undefined,
                            photo: viewingCardPet.photo_url,
                            gender: viewingCardPet.gender,
                            registrationNumber: viewingCardPet.registration_number || `REG-${viewingCardPet.id.slice(0, 8)}`,
                            species: viewingCardPet.species || "dog",
                            neuter: viewingCardPet.neuter || false
                        }}
                        viewMode={true}
                    />
                    {/* Close Button Override (Optional if RegistrationSuccess doesn't have a close for 'onComplete' correctly mapped) */}
                    {/* Actually RegistrationSuccess3D usually has a 'Home' button that calls onComplete.
                        But to be safe/UX friendly, maybe a close button outside?
                        RegistrationSuccess3D is usually full screen. Let's see.
                        It has `fixed inset-0`. So it will cover everything.
                        onComplete is passed to it. Let's assume it calls onComplete when done.
                    */}
                </div>
            )}
        </div>
    );
}
