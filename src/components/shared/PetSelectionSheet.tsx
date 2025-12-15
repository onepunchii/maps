import { useEffect, useState } from "react";
import { Settings, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pet } from "@/actions/pet";

interface PetSelectionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    currentPetId: string | null;
    pets: Pet[];
    onSelectPet: (pet: Pet) => void;
}

export default function PetSelectionSheet({ isOpen, onClose, currentPetId, pets, onSelectPet }: PetSelectionSheetProps) {
    const router = useRouter();
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small delay to allow mount before animating in
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`w-full max-w-[480px] bg-bg-card border-t border-[#333] rounded-t-[32px] p-6 pb-12 relative z-10 transition-transform duration-300 transform shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }} // Natural ease-out
            >
                {/* Handle Bar */}
                <div className="w-10 h-1 bg-[#444] rounded-full mx-auto mb-6"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">반려가족 선택</h3>
                    <button
                        onClick={() => router.push("/settings/pets")}
                        className="text-gray-400 hover:text-white hover:bg-[#333] p-2 rounded-full -mr-2 transition-colors"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* Pet List */}
                <div className="space-y-3 mb-6">
                    {pets.length > 0 ? (
                        pets.map((pet) => {
                            const isSelected = currentPetId === pet.id;
                            return (
                                <div
                                    key={pet.id}
                                    onClick={() => {
                                        onSelectPet(pet);
                                        onClose();
                                    }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border relative overflow-hidden group cursor-pointer transition-all active:scale-[0.98] ${isSelected ? 'bg-[#27272a] border-petudy-lime/30' : 'bg-bg-main border-[#333] hover:bg-[#222]'}`}
                                >
                                    {/* Active Glow for Selected */}
                                    {isSelected && <div className="absolute inset-0 bg-petudy-lime/5 pointer-events-none"></div>}

                                    {pet.photo_url ? (
                                        <div className={`w-12 h-12 rounded-full overflow-hidden relative z-10 shadow-md ${isSelected ? 'border-[1.5px] border-petudy-lime' : 'border border-[#444]'}`}>
                                            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full bg-[#333] flex items-center justify-center text-xl shadow-sm z-10 ${isSelected ? 'border-[1.5px] border-petudy-lime' : 'border border-[#444]'}`}>
                                            🐶
                                        </div>
                                    )}
                                    <div className="flex-1 z-10">
                                        <span className={`font-bold text-lg block ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{pet.name}</span>
                                        {isSelected && <span className="text-petudy-lime text-xs font-medium">현재 관리 중</span>}
                                    </div>

                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <div className="w-6 h-6 bg-petudy-lime rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(163,223,70,0.4)]">
                                            <Check className="w-3.5 h-3.5 text-bg-main stroke-[3]" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            등록된 반려동물이 없습니다.
                        </div>
                    )}
                </div>

                {/* Add New Pet Button */}
                <button
                    onClick={() => router.push("/register")}
                    className="w-full py-4 rounded-2xl border border-dashed border-[#444] text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-[#222] hover:text-petudy-lime hover:border-petudy-lime/50 transition-all active:scale-[0.99] group"
                >
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:bg-petudy-lime group-hover:border-petudy-lime group-hover:text-bg-main transition-colors">
                        <Plus className="w-3 h-3" />
                    </div>
                    새로운 아이 등록하기
                </button>
            </div>
        </div>
    );
}
