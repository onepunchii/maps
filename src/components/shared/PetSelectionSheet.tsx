import { useEffect, useState, useRef } from "react";
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

    // Drag Logic State
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef<number>(0);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            setDragOffset(0); // Reset drag
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const delta = currentY - startY.current;

        // Only allow dragging down
        if (delta > 0) {
            setDragOffset(delta);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (dragOffset > 120) { // Threshold to close
            onClose();
        } else {
            setDragOffset(0); // Bounce back
        }
    };

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
                className={`w-full max-w-[480px] bg-[#1E1E20] border-t border-[#333] rounded-t-[32px] p-6 pb-12 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`}
                style={{
                    transform: isVisible ? `translateY(${dragOffset}px)` : 'translateY(100%)',
                    transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Handle Bar (Visual cue for dragging) */}
                <div className="w-12 h-1.5 bg-[#444] rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6" onTouchStart={(e) => e.stopPropagation()}>
                    {/* Stop propagation on inner elements if we want drag only on header/handle. 
                        But typically sheets allow dragging from anywhere in the top area. 
                        For now, let's allow dragging the whole sheet container, but maybe stop propagation on the list to allow scrolling inside?
                        Actually, typical behavior: scroll content if overflow, drag sheet if at top. 
                        For simplicity in this V1, let's apply drag listeners to the container. 
                        If the pet list gets long, we might need more complex logic. 
                        Given the list is usually short, this is fine. */}
                    <h3 className="text-xl font-bold text-white tracking-tight">반려가족 선택</h3>
                    <button
                        onClick={() => router.push("/settings/pets")}
                        className="text-gray-400 hover:text-white hover:bg-[#333] p-2 rounded-full -mr-2 transition-colors"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* Pet List - Stop propagation to allow clicking/scrolling without dragging accidentally? 
                    Actually for now let's allow dragging from empty spaces or header. 
                    We should probably stop propagation on the list items to prevent accidental drags when clicking?
                    Let's keep it simple: Drag works on the main container. */}
                <div className="space-y-3 mb-6" onTouchStart={(e) => e.stopPropagation()}>
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
                                    className={`flex items-center gap-4 p-4 rounded-2xl border relative overflow-hidden group cursor-pointer transition-all active:scale-[0.98] ${isSelected ? 'bg-[#27272a] border-petudy-lime/30' : 'bg-[#121212] border-[#333] hover:bg-[#222]'}`}
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
                                        <span className={`font-bold text-lg block ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{pet.name}</span>
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
