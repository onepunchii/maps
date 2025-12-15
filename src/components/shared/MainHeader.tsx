"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Bell, User } from "lucide-react";

import PetSelectionSheet from "./PetSelectionSheet";

export default function MainHeader() {
    const [petPhoto, setPetPhoto] = useState<string | null>(null);
    const [petName, setPetName] = useState<string>("반려동물");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        // Load pet info from localStorage
        const storedPhoto = localStorage.getItem("petPhoto");
        const storedName = localStorage.getItem("petName");
        if (storedPhoto) setPetPhoto(storedPhoto);
        if (storedName) setPetName(storedName);
    }, []);

    return (
        <>
            <header className="flex justify-between items-center px-1 py-2 sticky top-0 z-10 transition-colors">
                {/* Left: Profile + Name + Arrow */}
                <button
                    onClick={() => setIsSheetOpen(true)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    {petPhoto ? (
                        <div className="w-9 h-9 rounded-full border border-gray-100 shadow-sm overflow-hidden relative">
                            <img src={petPhoto} alt="Pet" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-sm border border-gray-100">
                            🐶
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900 text-lg">{petName}</span>
                        <ChevronDown className="w-4 h-4 text-gray-900" />
                    </div>
                </button>

                {/* Right: Icons */}
                <div className="flex items-center gap-4">
                    <button className="p-1 text-gray-700 hover:text-black">
                        <Bell className="w-6 h-6" />
                    </button>
                    <button className="p-1 text-gray-700 hover:text-black">
                        <User className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <PetSelectionSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                currentPetId={null}
                pets={[]}
                onSelectPet={() => { }}
            />
        </>
    );
}
