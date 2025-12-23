"use client";

import { ChevronLeft, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ConsultPage() {
    const [input, setInput] = useState("");

    return (
        <div className="min-h-screen bg-[#121212] flex justify-center overflow-y-auto">
            <div className="w-full max-w-[512px] bg-bg-main min-h-screen border-x border-[#121212] relative flex flex-col">

                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                    <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-petudy-lime" />
                        AI 닥터 멍냥
                    </h1>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-petudy-lime to-green-300 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(163,223,70,0.3)]">
                        <span className="text-5xl">🤖</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white leading-tight">
                        무엇이든 물어보세요!<br />
                        <span className="text-petudy-lime">펫터디 AI 매니저</span>입니다.
                    </h2>

                    <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                        아이의 증상이 궁금하거나<br />
                        앱 사용법이 헷갈리실 때 언제든 찾아주세요.<br />
                        (현재 서비스 준비 중입니다)
                    </p>

                    <div className="w-full max-w-sm bg-[#1e1e20] rounded-2xl p-4 border border-white/5 text-left space-y-3 mt-8">
                        <div className="text-xs text-gray-500 font-bold ml-1">추천 질문</div>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 rounded-xl bg-[#2a2a2c] hover:bg-[#333] transition-colors text-sm text-gray-200">
                                💊 강아지가 초콜릿을 먹었어요!
                            </button>
                            <button className="w-full text-left p-3 rounded-xl bg-[#2a2a2c] hover:bg-[#333] transition-colors text-sm text-gray-200">
                                💳 펫 패스는 무료인가요?
                            </button>
                        </div>
                    </div>
                </div>

                {/* Input Area (Placeholder) */}
                <div className="p-4 border-t border-white/5 bg-[#121212]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            className="w-full bg-[#1e1e20] border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-petudy-lime/50 transition-colors"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-petudy-lime flex items-center justify-center text-bg-main hover:bg-[#bbf080] transition-colors"
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
