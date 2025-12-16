import React from "react";

interface StepReviewProps {
    formData: {
        name: string;
        species: "dog" | "cat";
        breed?: string | null;
        gender: "male" | "female";
        neuter: boolean | null;
        birth?: string;
        adoptionDate?: string;
        weight?: string;
        color?: string;
        concern?: string[];
        reg_number?: string | null;
        [key: string]: any;
    };
}

export default function StepReview({ formData }: StepReviewProps) {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const [y, m, d] = dateStr.split("-");
        return `${y}.${m}.${d}`;
    };

    const getConcernLabels = (concerns?: string[]) => {
        if (!concerns || concerns.length === 0 || concerns.includes("none")) return "없음";
        // Map values to labels manually or passed from parent? 
        // For simplicity, let's duplicate the simple map or jusy rely on parent? 
        // Better: Self-contained.
        const map: Record<string, string> = {
            skin: "피부/알러지",
            joint: "관절/뼈",
            digestive: "소화기/위장",
            dental: "치아/구강",
            weight: "비만/체중",
            heart: "심장/호흡기",
            eye: "눈/귀",
            behavior: "행동/분리불안",
        };
        return concerns.map(c => map[c] || c).join(", ");
    };

    const details = [
        { label: "이름", value: formData.name },
        { label: "종류", value: formData.species === "dog" ? "강아지" : "고양이" },
        { label: "품종", value: formData.breed || "-" },
        {
            label: "성별",
            value: `${formData.gender === "male" ? "왕자님" : "공주님"} ${formData.neuter ? "(중성화 O)" : "(중성화 X)"}`
        },
        { label: "생일", value: formatDate(formData.birth) },
        { label: "입양일", value: formatDate(formData.adoptionDate) },
        { label: "몸무게", value: formData.weight ? `${formData.weight}kg` : "-" },
        { label: "모색", value: formData.color || "-" },
        { label: "건강고민", value: getConcernLabels(formData.concern) },
        { label: "등록번호", value: formData.reg_number || "-" },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
                입력한 내용이 맞나요?
            </h2>

            <div className="bg-bg-input p-6 rounded-2xl shadow-inner border border-[#333] space-y-3">
                {details.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-[#444] pb-2 last:border-0">
                        <span className="text-gray-500 text-xs font-medium">{item.label}</span>
                        <span className="font-medium text-white text-right max-w-[60%] break-keep text-sm">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
                * 등록 후에도 언제든 수정할 수 있어요.
            </p>
        </div>
    );
}
