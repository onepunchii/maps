"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Type, Image as ImageIcon, Send } from "lucide-react";
import { createPoll } from "@/actions/poll";

type PollType = "VS_IMAGE" | "TEXT_CHOICE";

export default function PollCreationForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [pollType, setPollType] = useState<PollType>("VS_IMAGE");
    const [isLoading, setIsLoading] = useState(false);

    // Image Mode State
    const [imageA, setImageA] = useState("");
    const [imageB, setImageB] = useState("");
    const [textA, setTextA] = useState("");
    const [textB, setTextB] = useState("");

    // Text Mode State
    const [options, setOptions] = useState(["", ""]);

    const handleSubmit = async () => {
        if (!title.trim()) return alert("질문을 입력해주세요.");
        setIsLoading(true);

        const payload = {
            title,
            type: pollType,
            options: [] as { text: string; image?: string }[]
        };

        if (pollType === "VS_IMAGE") {
            if (!imageA || !imageB || !textA || !textB) {
                setIsLoading(false);
                return alert("이미지와 선택지 이름을 모두 입력해주세요.");
            }
            payload.options = [
                { text: textA, image: imageA },
                { text: textB, image: imageB }
            ];
        } else {
            const validOptions = options.filter(o => o.trim());
            if (validOptions.length < 2) {
                setIsLoading(false);
                return alert("최소 2개의 선택지를 입력해주세요.");
            }
            payload.options = validOptions.map(text => ({ text }));
        }

        const res = await createPoll(payload);
        if (res.success) {
            router.push("/community/petpick");
        } else {
            alert(res.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 space-y-8 pb-32">
            {/* Type Selector */}
            <div className="flex bg-[#2c2c2e] p-1 rounded-xl">
                <button
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${pollType === "VS_IMAGE" ? "bg-[#3a3a3c] text-white shadow-md" : "text-gray-500"}`}
                    onClick={() => setPollType("VS_IMAGE")}
                >
                    <ImageIcon className="w-4 h-4" />
                    사진 투표
                </button>
                <button
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${pollType === "TEXT_CHOICE" ? "bg-[#3a3a3c] text-white shadow-md" : "text-gray-500"}`}
                    onClick={() => setPollType("TEXT_CHOICE")}
                >
                    <Type className="w-4 h-4" />
                    텍스트 투표
                </button>
            </div>

            {/* Question Input */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">질문</label>
                <input
                    type="text"
                    placeholder="예: 우리 강아지 미용 스타일 골라주세요!"
                    className="w-full bg-[#1c1c1e] text-white p-4 rounded-xl border border-white/10 focus:border-petudy-lime focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Builder Area */}
            {pollType === "VS_IMAGE" ? (
                <div className="flex gap-4">
                    {/* Option A */}
                    <div className="flex-1 space-y-3">
                        <div className="aspect-square bg-[#1c1c1e] rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:border-petudy-lime cursor-pointer relative overflow-hidden group">
                            {imageA ? (
                                <img src={imageA} alt="A" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-xs">사진 A</span>
                                </>
                            )}
                            <input
                                type="text"
                                placeholder="이미지 주소..."
                                className="absolute bottom-0 w-full bg-black/50 text-white text-xs p-1"
                                value={imageA}
                                onChange={e => setImageA(e.target.value)}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="선택지 A 이름"
                            className="w-full bg-transparent border-b border-white/20 py-2 text-center focus:border-petudy-lime focus:outline-none"
                            value={textA}
                            onChange={(e) => setTextA(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center font-black text-petudy-lime italic text-xl">VS</div>
                    {/* Option B */}
                    <div className="flex-1 space-y-3">
                        <div className="aspect-square bg-[#1c1c1e] rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:border-petudy-lime cursor-pointer relative overflow-hidden group">
                            {imageB ? (
                                <img src={imageB} alt="B" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-xs">사진 B</span>
                                </>
                            )}
                            <input
                                type="text"
                                placeholder="이미지 주소..."
                                className="absolute bottom-0 w-full bg-black/50 text-white text-xs p-1"
                                value={imageB}
                                onChange={e => setImageB(e.target.value)}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="선택지 B 이름"
                            className="w-full bg-transparent border-b border-white/20 py-2 text-center focus:border-petudy-lime focus:outline-none"
                            value={textB}
                            onChange={(e) => setTextB(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-400">선택지 (최대 4개)</label>
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="text-petudy-lime font-bold w-6">{idx + 1}</span>
                            <input
                                type="text"
                                className="flex-1 bg-[#1c1c1e] p-3 rounded-lg border border-white/10"
                                placeholder={`옵션 ${idx + 1}`}
                                value={opt}
                                onChange={(e) => {
                                    const newOpts = [...options];
                                    newOpts[idx] = e.target.value;
                                    setOptions(newOpts);
                                }}
                            />
                        </div>
                    ))}
                    {options.length < 4 && (
                        <button
                            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 ml-8"
                            onClick={() => setOptions([...options, ""])}
                        >
                            + 항목 추가
                        </button>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full bg-petudy-lime text-bg-main font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-95 disabled:opacity-50"
            >
                {isLoading ? "등록 중..." : (
                    <>
                        <Send className="w-5 h-5" />
                        투표 올리기
                    </>
                )}
            </button>
        </div>
    );
}
