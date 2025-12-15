"use client";

import React, { useState } from "react";
import RegistrationSuccess3D from "./RegistrationSuccess3D";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight, X, Check, Mars, Venus, Sparkles, Bone, Stethoscope, Scale, Eye, Brain, Activity, Heart, ThumbsUp, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImportRegistrationModal from "./ImportRegistrationModal";
import DatePickerModal from "./DatePickerModal";
import PetBreedSearch from "./PetBreedSearch";

// Step Configuration Type
type StepConfig = {
    id: string;
    question: string;
    subtext?: string;
    type: "text" | "select" | "date" | "number" | "radio" | "review" | "multi-select" | "image";
    options?: { label: string; value: string; image?: string; emoji?: string; color?: string }[];
    placeholder?: string;
};

// 13 Steps Configuration (Neuter merged into Gender UI, removed as separate step)
const STEPS: StepConfig[] = [
    { id: "name", question: "아이의 이름은 무엇인가요?", type: "text", placeholder: "예: 뽀삐" },
    { id: "species", question: "어떤 아이와 살고 있나요?", type: "radio", options: [{ label: "강아지", value: "dog", image: "/images/dog-character.png" }, { label: "고양이", value: "cat", image: "/images/cat-character.png" }] },
    { id: "breed", question: "견종/묘종을 알려주세요.", subtext: "맞춤 케어를 제공해 드립니다.", type: "text", placeholder: "예: 말티즈, 코숏" },
    { id: "gender", question: "성별은 무엇인가요?", type: "radio", options: [{ label: "왕자님", value: "male" }, { label: "공주님", value: "female" }] },
    // Neuter removed as separate step
    { id: "birth", question: "생일은 언제인가요?", subtext: "정확하지 않아도 괜찮아요. 프로필에서 수정가능", type: "date" },
    { id: "weight", question: "몸무게는?", subtext: "소수점 두 자리까지 입력할 수 있어요.", type: "text", placeholder: "0.00 kg" },
    {
        id: "color",
        question: "털 색상은?",
        type: "radio",
        options: [
            { label: "흰색", value: "white", color: "#FFFFFF" },
            { label: "흰색 + 금색", value: "white_gold", color: "linear-gradient(90deg, #FFFFFF 50%, #F5E0B6 50%)" },
            { label: "금색", value: "gold", color: "#F5E0B6" },
            { label: "흰색 + 황색", value: "white_hwang", color: "linear-gradient(90deg, #FFFFFF 50%, #DFA837 50%)" },
            { label: "황색", value: "hwang", color: "#DFA837" },
            { label: "흰색 + 갈색", value: "white_brown", color: "linear-gradient(90deg, #FFFFFF 50%, #A5512B 50%)" },
            { label: "갈색", value: "brown", color: "#A5512B" },
            { label: "흰색 + 회색", value: "white_grey", color: "linear-gradient(90deg, #FFFFFF 50%, #808080 50%)" },
            { label: "회색", value: "grey", color: "#808080" },
            { label: "흰색 + 검은색", value: "white_black", color: "linear-gradient(90deg, #FFFFFF 50%, #000000 50%)" },
            { label: "검은색", value: "black", color: "#000000" },
            { label: "검은색 + 금색", value: "black_gold", color: "linear-gradient(90deg, #000000 50%, #F5E0B6 50%)" },
            { label: "기타", value: "other", color: "#424258" }
        ]
    },
    {
        id: "concern",
        question: "고민은 무엇인가요?",
        subtext: "다중 선택 가능합니다.",
        type: "multi-select",
        options: [
            { label: "피부/털", value: "skin" },
            { label: "관절/뼈", value: "joint" },
            { label: "소화기/배변", value: "digest" },
            { label: "체중/식습관", value: "weight_food" },
            { label: "눈/귀 건강", value: "eye_ear" },
            { label: "행동/심리", value: "behavior" },
            { label: "치아/구강", value: "teeth" },
            { label: "호흡기/심장", value: "breath" },
            { label: "건강해요!", value: "none" }
        ]
    },
    {
        id: "photo",
        question: "마지막이에요!",
        type: "image"
    }
];

// Define Props
interface RegistrationWizardProps {
    onComplete?: () => void;
    initialData?: Record<string, any>; // Optional initial data for edit mode
    isEditMode?: boolean; // Flag to indicate edit mode
    petId?: string; // ID for update action
}

export default function RegistrationWizard({ onComplete, initialData, isEditMode = false, petId }: RegistrationWizardProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
    const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();
    const [openDateField, setOpenDateField] = useState<string | null>(null);

    const currentStep = STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Server Action Import (Dynamic import to avoid build issues if server actions behave weirdly in client components during dev, but standard import is fine usually. using standard at top level)
    // import { createPet } from "@/actions/pet"; -> Needs to be added to top imports

    const handleNext = async () => {
        if (isLastStep) {
            setIsSubmitting(true);
            try {
                // Prepare data for Server Action
                const payload = {
                    name: formData.name,
                    species: formData.species || "dog",
                    breed: formData.breed || null,
                    gender: formData.gender,
                    neuter: formData.neuter || "no",
                    birth: formData.birth || null,
                    weight: formData.weight || null,
                    color: formData.color || null,
                    concern: formData.concern || [],
                    photo: formData.photo || null, // Allow photo to be passed if it exists
                    reg_number: formData.reg_number || null,
                    adoptionDate: formData.adoptionDate || null,
                };

                // Dynamic import to ensure it works in client component context
                const { createPet, updatePet } = await import("@/actions/pet");

                if (isEditMode && petId) {
                    await updatePet(petId, payload as any);
                } else {
                    await createPet(payload as any);
                }

                setIsCompleted(true);
            } catch (error) {
                console.error("Registration/Update failed:", error);
                alert("처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setIsSubmitting(false);
        }
        setCurrentStepIndex((prev) => prev + 1);
    }
};

const handlePrev = () => {
    if (!isFirstStep && !isSubmitting) {
        setCurrentStepIndex((prev) => prev - 1);
    }
};

const handleChange = (value: any) => {
    if (currentStep.type === "multi-select") {
        setFormData(prev => {
            const currentValues: string[] = prev[currentStep.id] || [];
            if (value === "none") {
                return { ...prev, [currentStep.id]: currentValues.includes("none") ? [] : ["none"] };
            } else {
                if (currentValues.includes("none")) {
                    return { ...prev, [currentStep.id]: [value] };
                }
                if (currentValues.includes(value)) {
                    return { ...prev, [currentStep.id]: currentValues.filter(v => v !== value) };
                } else {
                    return { ...prev, [currentStep.id]: [...currentValues, value] };
                }
            }
        });
    } else {
        setFormData(prev => ({ ...prev, [currentStep.id]: value }));
    }
};

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, [currentStep.id]: imageUrl }));
    }
};

// Helper to toggle neuter state
const toggleNeuter = () => {
    setFormData(prev => ({
        ...prev,
        neuter: prev.neuter === "yes" ? "no" : "yes"
    }));
};

const [isImportModalOpen, setIsImportModalOpen] = useState(false);

const handleImportRegistration = ({
    ownerName,
    regNumber,
    petName,
    species,
    breed,
    gender,
    neuter
}: {
    ownerName: string;
    regNumber: string;
    petName?: string;
    species?: "dog" | "cat";
    breed?: string;
    gender?: "male" | "female";
    neuter?: "yes" | "no";
}) => {
    setFormData(prev => ({
        ...prev,
        reg_number: regNumber,
        name: petName || prev.name,
        species: species || prev.species,
        breed: breed || prev.breed,
        gender: gender || prev.gender || null,
        neuter: neuter || prev.neuter || null,
    }));

    alert(`동물등록번호(${regNumber}) 정보가 입력되었습니다!\n확인을 누르면 다음 단계로 진행하거나 정보를 수정할 수 있습니다.`);
    setIsImportModalOpen(false);
};

const handleDateSelect = (date: string) => {
    if (openDateField) {
        setFormData(prev => ({ ...prev, [openDateField]: date }));
        setOpenDateField(null);
    }
};

// Helper helper for formatting date display (YYYY.MM.DD)
const formatDateObj = (dateStr?: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${y}. ${m}. ${d} `;
};

const isStepValid = () => {
    if (currentStep.id === "photo") {
        return true; // Photo is optional
    }
    if (currentStep.type === "multi-select") {
        return (formData[currentStep.id] && formData[currentStep.id].length > 0);
    }
    return !!formData[currentStep.id];
};

if (isCompleted) {
    return (
        <RegistrationSuccess3D
            onComplete={() => isEditMode ? router.push("/settings/pets") : router.push("/")}
            formData={formData as any}
        />
    );
}

return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden bg-bg-main touch-none text-white">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-petudy-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        {/* Import Modal */}
        <ImportRegistrationModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImport={handleImportRegistration}
        />

        {/* Date Picker Modal */}
        <DatePickerModal
            isOpen={!!openDateField}
            onClose={() => setOpenDateField(null)}
            onSelect={handleDateSelect}
            title={openDateField === "adoptionDate" ? "입양일 선택" : "생일 선택"}
            initialDate={openDateField ? formData[openDateField] : undefined}
        />

        {/* Header */}
        <header className="px-4 py-2 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
                {isFirstStep ? (
                    <Link href="/">
                        <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                    </Link>
                ) : (
                    <button onClick={handlePrev} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-300" />
                    </button>
                )}
            </div>
            <div className="flex gap-1">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentStepIndex ? "w-6 bg-petudy-lime shadow-[0_0_10px_#A3DF46]" : "w-1.5 bg-[#333]"
                            } `}
                    />
                ))}
            </div>
            <div className="w-6" />
        </header>

        {/* Content Area - Adjusted for single screen fit */}
        <main className="flex-1 px-6 flex flex-col justify-center max-w-[430px] mx-auto w-full pb-20 relative z-0">
            <div className="p-8 rounded-[32px] bg-bg-card border border-[#333] shadow-lg animate-fade-in-up">
                <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-bold text-white leading-tight">
                        {currentStep.id === "breed" ? (
                            <>
                                <span className="text-petudy-lime">{formData.name}</span>
                                {formData.species === "cat" ? " 묘종은?" : " 견종은?"}
                            </>
                        ) : currentStep.id === "birth" ? (
                            <>
                                <span className="text-petudy-lime">{formData.name}</span>
                                생일은 언제인가요?
                            </>
                        ) : currentStep.id === "weight" ? (
                            <>
                                <span className="text-petudy-lime">{formData.name}</span> 의
                                몸무게는?
                            </>
                        ) : currentStep.id === "color" ? (
                            <>
                                <span className="text-petudy-lime">{formData.name}</span> 의
                                털 색상은?
                            </>
                        ) : currentStep.id === "concern" ? (
                            <>
                                <span className="text-petudy-lime">{formData.name}</span> 의
                                고민은?
                            </>
                        ) : currentStep.id === "photo" ? (
                            <>
                                마지막이에요!<br />
                                <span className="text-petudy-lime">{formData.name}</span> 의
                                인생샷을 보여주세요
                            </>
                        ) : (
                            currentStep.question
                        )}
                    </h2>
                    {currentStep.subtext && (
                        <p className="text-gray-400 text-sm">{currentStep.subtext}</p>
                    )}
                </div>

                {/* Dynamic Input Render */}
                <div className="delay-100 transition-opacity duration-500">
                    {currentStep.id === "breed" ? (
                        <PetBreedSearch
                            species={formData.species || "dog"}
                            value={formData.breed || ""}
                            onChange={(val) => handleChange(val)}
                        />
                    ) : currentStep.type === "text" || currentStep.type === "number" ? (
                        <input
                            type={currentStep.type}
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder={currentStep.placeholder}
                            inputMode={currentStep.id === "weight" ? "decimal" : undefined}
                            className="w-full bg-bg-input border-b-2 border-[#444] py-4 text-xl text-white placeholder-gray-500 focus:border-petudy-lime focus:outline-none transition-colors rounded-t-lg px-2"
                        />
                    ) : currentStep.type === "image" ? (
                        <div className="w-full">
                            <label className="block w-full aspect-square rounded-[32px] border-2 border-dashed border-[#444] bg-bg-input hover:border-petudy-lime hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                {formData[currentStep.id] ? (
                                    <NextImage
                                        src={formData[currentStep.id]}
                                        alt="Pet Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-petudy-lime transition-colors">
                                        <CalendarIcon className="w-12 h-12 stroke-[1.5]" />
                                        <span className="text-sm font-medium">사진을 올려주세요</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    ) : currentStep.type === "radio" || currentStep.type === "select" || currentStep.type === "multi-select" ? (
                        <div className="w-full">
                            <div className={`space-y-3 ${["species", "gender", "color", "concern"].includes(currentStep.id) ? "grid grid-cols-2 gap-3 space-y-0" : ""} ${currentStep.id === "color" ? "!gap-2 !space-y-0" : ""} ${currentStep.id === "concern" ? "grid-cols-3 !gap-2 !space-y-0" : ""} `}>
                                {currentStep.options?.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleChange(opt.value)}
                                        className={`w-full rounded-2xl border font-medium transition-all flex items-center ${["species", "gender"].includes(currentStep.id)
                                            ? "aspect-square flex-col justify-center gap-2 text-center p-4"
                                            : currentStep.id === "color"
                                                ? "p-2 px-3 flex-row justify-start gap-2 h-auto"
                                                : currentStep.id === "concern"
                                                    ? "aspect-square flex-col justify-center gap-1 text-center p-2"
                                                    : "p-4 text-left justify-between"
                                            } ${(currentStep.type === "multi-select"
                                                ? (formData[currentStep.id] || []).includes(opt.value)
                                                : formData[currentStep.id] === opt.value)
                                                ? "bg-bg-input border-petudy-lime text-petudy-lime shadow-[0_0_15px_rgba(163,223,70,0.2)]"
                                                : "bg-bg-input border-[#333] text-gray-400 hover:border-gray-500 hover:text-white"
                                            } `}
                                    >
                                        {currentStep.id === "species" ? (
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                {opt.image ? (
                                                    <div className="relative w-20 h-20">
                                                        <NextImage
                                                            src={opt.image}
                                                            alt={opt.label}
                                                            fill
                                                            className="object-contain" // Keep original images
                                                            priority
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-4xl filter drop-shadow-lg">{opt.emoji}</span>
                                                )}
                                                <span className="text-lg font-bold">{opt.label}</span>
                                            </div>
                                        ) : currentStep.id === "gender" ? (
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                {opt.value === "male" ? (
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${formData.gender === "male" ? "bg-blue-500/20" : "bg-[#222]"
                                                        } `}>
                                                        <Mars className={`w-8 h-8 ${formData.gender === "male" ? "text-blue-400" : "text-gray-500"
                                                            } `} strokeWidth={2.5} />
                                                    </div>
                                                ) : (
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${formData.gender === "female" ? "bg-pink-500/20" : "bg-[#222]"
                                                        } `}>
                                                        <Venus className={`w-8 h-8 ${formData.gender === "female" ? "text-pink-400" : "text-gray-500"
                                                            } `} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                                <span className={`text-base font-bold ${formData.gender === opt.value
                                                    ? (opt.value === "male" ? "text-blue-400" : "text-pink-400")
                                                    : "text-gray-500"
                                                    } `}>
                                                    {opt.label}
                                                </span>
                                            </div>
                                        ) : currentStep.id === "color" ? (
                                            <>
                                                <div
                                                    className="w-8 h-8 rounded-full border border-gray-600 shadow-sm shrink-0"
                                                    style={{ background: opt.color }}
                                                />
                                                <span className="text-sm font-bold text-gray-300">{opt.label}</span>
                                            </>
                                        ) : currentStep.id === "concern" ? (
                                            <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
                                                {opt.value === "skin" && <Sparkles className="w-6 h-6 mb-1" />}
                                                {opt.value === "joint" && <Bone className="w-6 h-6 mb-1" />}
                                                {opt.value === "digest" && <Stethoscope className="w-6 h-6 mb-1" />}
                                                {opt.value === "weight_food" && <Scale className="w-6 h-6 mb-1" />}
                                                {opt.value === "eye_ear" && <Eye className="w-6 h-6 mb-1" />}
                                                {opt.value === "behavior" && <Brain className="w-6 h-6 mb-1" />}
                                                {opt.value === "teeth" && <Activity className="w-6 h-6 mb-1" />}
                                                {opt.value === "breath" && <Heart className="w-6 h-6 mb-1" />}
                                                {opt.value === "none" && <ThumbsUp className="w-6 h-6 mb-1" />}
                                                <span className="text-xs font-medium whitespace-nowrap">{opt.label}</span>
                                            </div>
                                        ) : (
                                            <>
                                                {opt.label}
                                                {formData[currentStep.id] === opt.value && <Check className="w-5 h-5 text-petudy-lime" />}
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Neuter Toggle Button (Only for Gender Step) */}
                            {currentStep.id === "gender" && (
                                <button
                                    type="button"
                                    onClick={toggleNeuter}
                                    className={`w-full mt-4 p-4 rounded-xl border flex items-center justify-between transition-all ${formData.neuter === "yes"
                                        ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg"
                                        : "bg-bg-input border-[#333] text-gray-500 hover:bg-[#252527]"
                                        } `}
                                >
                                    <span className="text-lg font-medium">중성화를 했어요</span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${formData.neuter === "yes" ? "bg-purple-500 border-purple-500" : "border-gray-500 bg-[#333]"
                                        } `}>
                                        {formData.neuter === "yes" && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </button>
                            )}
                        </div>
                    ) : currentStep.type === "date" ? (
                        <div className="space-y-6">
                            {/* Birthday Input */}
                            <div className="space-y-2 relative">
                                <div
                                    onClick={() => setOpenDateField(currentStep.id)}
                                    className="w-full p-4 rounded-xl bg-bg-input border border-[#333] text-lg text-white flex items-center justify-between cursor-pointer hover:border-petudy-lime transition-colors"
                                >
                                    <span className={formData[currentStep.id] ? "text-white" : "text-gray-500"}>
                                        {formatDateObj(formData[currentStep.id]) || "YYYY. MM. DD"}
                                    </span>
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Adoption Date Input */}
                            <div className="space-y-2">
                                <label className="text-lg font-bold text-gray-300 block">
                                    입양일은 언제인가요?
                                </label>
                                <div
                                    onClick={() => setOpenDateField("adoptionDate")}
                                    className="w-full p-4 rounded-xl bg-bg-input border border-[#333] text-lg text-white flex items-center justify-between cursor-pointer hover:border-petudy-lime transition-colors"
                                >
                                    <span className={formData.adoptionDate ? "text-white" : "text-gray-500"}>
                                        {formatDateObj(formData.adoptionDate) || "YYYY. MM. DD"}
                                    </span>
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    ) : currentStep.type === "review" ? (
                        <div className="space-y-4 bg-bg-input p-6 rounded-2xl shadow-inner border border-[#333]">
                            {STEPS.slice(0, -1).map(s => {
                                // Helper to find label for a value
                                const getLabel = (val: string) => {
                                    return s.options?.find(o => o.value === val)?.label || val;
                                };

                                let displayValue = "-";
                                const value = formData[s.id];

                                if (s.id === "gender") {
                                    displayValue = `${value === "male" ? "왕자님" : "공주님"} ${formData.neuter === "yes" ? "(중성화 O)" : "(중성화 X)"}`;
                                } else if (s.type === "multi-select" && Array.isArray(value)) {
                                    displayValue = value.map(v => getLabel(v)).join(", ");
                                } else if (value && s.options) {
                                    displayValue = getLabel(value); // Map single select values
                                } else if (value) {
                                    displayValue = value; // Text inputs
                                }

                                return (
                                    <div key={s.id} className="flex justify-between border-b border-[#444] pb-2 last:border-0">
                                        <span className="text-gray-500 text-sm">{s.question.split(" ")[0]}...</span>
                                        <span className="font-medium text-white text-right max-w-[60%] break-keep">
                                            {displayValue}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                {/* Conditional Rendering for Import Registration Number */}
                {currentStep.id === "species" && (
                    <div className="mt-6 animate-fade-in-up">
                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(true)}
                            className="w-full bg-[#333] p-4 rounded-xl flex items-center justify-center text-gray-300 font-bold hover:bg-[#444] transition-colors border border-gray-700"
                        >
                            동물등록번호 불러오기
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            * 일부 정보를 간편하게 자동으로 등록할 수 있어요.
                        </p>
                    </div>
                )}
            </div>
        </main>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 flex justify-center z-50">
            <div className="w-full max-w-[430px] flex items-center justify-center gap-3">
                {!isFirstStep && (
                    <button
                        onClick={handlePrev}
                        className="w-14 h-14 rounded-2xl bg-[#2C2C2E] border border-[#333] flex items-center justify-center text-gray-400 hover:bg-[#3A3A3D] transition-colors hover:text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={!formData[currentStep.id] && currentStep.type !== "review" && !["snack", "memo", "photo"].includes(currentStep.id)}
                    className={`h-14 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 flex-1 ${(formData[currentStep.id] || currentStep.type === "review" || ["snack", "memo", "photo"].includes(currentStep.id))
                        ? "bg-petudy-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-[0.98]"
                        : "bg-[#2C2C2E] text-gray-600 border border-[#333] cursor-not-allowed"
                        } `}
                >
                    {isLastStep ? "등록 완료" : "다음"}
                    {!isLastStep && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    </div>
);
}
