"use client";

import { useState } from "react";
import { RankingBanner } from "@/components/contest/RankingBanner";
import { PhotoCard } from "@/components/contest/PhotoCard";
import { FloatingActionButton } from "@/components/contest/FloatingActionButton";
import { ContestEntry } from "@/components/contest/types";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";

// Mock Data
const INITIAL_ENTRIES: ContestEntry[] = [
    {
        id: 1,
        petName: "두부",
        ownerName: "김철수",
        imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
        caption: "우리 두부 윙크하는 거 보세요! 너무 귀엽죠? 🐶",
        voteCount: 1240,
        rank: 1
    },
    {
        id: 2,
        petName: "초코",
        ownerName: "이영희",
        imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
        caption: "산책 다녀와서 뻗은 초코... ㅋㅋㅋ",
        voteCount: 980,
        rank: 2
    },
    {
        id: 3,
        petName: "구름이",
        ownerName: "박지민",
        imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
        caption: "펫터디 모델은 나야 나!",
        voteCount: 856,
        rank: 3
    },
    {
        id: 4,
        petName: "멍이",
        ownerName: "최준호",
        imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop",
        caption: "증명사진st 조명이 좋아서 한 컷",
        voteCount: 420
    },
    {
        id: 5,
        petName: "냥이",
        ownerName: "정서연",
        imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
        caption: "고양이가 세상을 지배한다",
        voteCount: 312
    },
    {
        id: 6,
        petName: "뽀삐",
        ownerName: "강민수",
        imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop",
        caption: "꽃개 🌸",
        voteCount: 150
    },
];

import { UploadEntrySheet } from "@/components/contest/UploadEntrySheet";

export default function ContestPage() {
    const [entries, setEntries] = useState<ContestEntry[]>(INITIAL_ENTRIES);
    const [votedIds, setVotedIds] = useState<number[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(12);

    const handleVote = (id: number) => {
        if (votedIds.includes(id)) {
            setVotedIds(prev => prev.filter(vId => vId !== id));
            setEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, voteCount: entry.voteCount - 1 } : entry
            ));
        } else {
            setVotedIds(prev => [...prev, id]);
            setEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, voteCount: entry.voteCount + 1 } : entry
            ));
        }
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => prev === 1 ? 12 : prev - 1);
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => prev === 12 ? 1 : prev + 1);
    };

    const handleUploadSubmit = (data: { petId: number; image: File | null; caption: string }) => {
        // Optimistic update for demo
        const newEntry: ContestEntry = {
            id: Date.now(),
            petName: "두부", // Mock
            ownerName: "나",
            imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?q=80&w=800&auto=format&fit=crop", // Mock image for demo if no real upload logic yet
            caption: data.caption,
            voteCount: 0
        };
        setEntries(prev => [newEntry, ...prev]);
        setIsUploadOpen(false); // Close the sheet after submission
    };

    const sortedEntries = [...entries].sort((a, b) => b.voteCount - a.voteCount);
    const topEntries = sortedEntries.slice(0, 3);

    return (
        <div className="min-h-screen bg-bg-main pb-24 text-white">
            {/* Header */}
            <header className="sticky top-0 bg-bg-main/80 backdrop-blur-md z-30 border-b border-[#333] px-4 h-14 flex items-center justify-between">
                <button onClick={handlePrevMonth} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-petudy-lime fill-current" />
                    {currentMonth}월 모델 선발대회
                </h1>
                <button onClick={handleNextMonth} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content */}
            <main>
                {/* Ranking Banner */}
                <section className="mb-2">
                    <RankingBanner topEntries={topEntries} />
                </section>

                {/* Filter / Tabs */}
                <section className="px-4 mb-4 flex gap-2">
                    <button className="px-4 py-2 bg-petudy-lime text-bg-main rounded-full text-sm font-bold shadow-[0_0_10px_rgba(163,223,70,0.3)]">
                        🔥 인기순
                    </button>
                    <button className="px-4 py-2 bg-[#2C2C2E] text-gray-400 border border-[#333] rounded-full text-sm font-medium hover:text-white transition-colors">
                        ✨ 최신순
                    </button>
                </section>

                {/* Masonry Feed */}
                <section className="px-4">
                    <div className="columns-2 gap-4 space-y-4">
                        {entries.map(entry => (
                            <PhotoCard
                                key={entry.id}
                                entry={entry}
                                onVote={handleVote}
                                isVoted={votedIds.includes(entry.id)}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <FloatingActionButton onClick={() => setIsUploadOpen(true)} />

            <UploadEntrySheet
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSubmit={handleUploadSubmit}
            />
        </div>
    );
}
