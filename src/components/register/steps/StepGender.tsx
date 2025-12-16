import React from "react";
import { Check } from "lucide-react";
import Image from "next/image";

interface StepGenderProps {
    formData: {
        gender: "male" | "female" | null | undefined;
        neuter: boolean | null;
        [key: string]: any;
    };
    onChange: (field: string, value: any) => void;
}

export default function StepGender({ formData, onChange }: StepGenderProps) {
    const toggleNeuter = () => {
        // Toggle strict boolean
        onChange("neuter", !formData.neuter);
    };

    return (
        <div className="space-y-6 animate-fade-in-up h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-10 text-white text-center">
                성별을 알려주세요
            </h2>
            <div className="flex gap-4">
                <button
                    onClick={() => onChange("gender", "male")}
                    className={`flex-1 p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 ${formData.gender === "male"
                        ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        : "bg-bg-input border-[#333] text-gray-500 hover:bg-[#252527]"
                        }`}
                >
                    <div className="relative w-24 h-24">
                        <Image
                            src="/images/gender-male-symbol.png"
                            alt="왕자님"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                    <div className="font-bold text-lg">왕자님</div>
                </button>
                <button
                    onClick={() => onChange("gender", "female")}
                    className={`flex-1 p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 ${formData.gender === "female"
                        ? "bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                        : "bg-bg-input border-[#333] text-gray-500 hover:bg-[#252527]"
                        }`}
                >
                    <div className="relative w-24 h-24">
                        <Image
                            src="/images/gender-female-symbol.png"
                            alt="공주님"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                    <div className="font-bold text-lg">공주님</div>
                </button>
            </div>

            {/* Neuter Toggle - Only shows after gender selection */}
            {formData.gender && (
                <div className="animate-fade-in-up pt-4">
                    <label className="text-lg font-bold text-gray-300 mb-3 block">
                        중성화 수술을 했나요?
                    </label>
                    <button
                        onClick={toggleNeuter}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${formData.neuter === true
                            ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg"
                            : "bg-bg-input border-[#333] text-gray-500 hover:bg-[#252527]"
                            } `}
                    >
                        <span className="text-lg font-medium">중성화를 했어요</span>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${formData.neuter === true ? "bg-purple-500 border-purple-500" : "border-gray-500 bg-[#333]"
                            } `}>
                            {formData.neuter === true && <Check className="w-4 h-4 text-white" />}
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
