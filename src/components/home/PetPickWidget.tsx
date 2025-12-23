"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, MessageCircle, Share2, Sparkles } from "lucide-react";
import { Poll, votePoll } from "@/actions/poll";

interface PetPickWidgetProps {
    initialPoll: Poll | null;
}

export default function PetPickWidget({ initialPoll }: PetPickWidgetProps) {
    const [poll, setPoll] = useState<Poll | null>(initialPoll);
    const [isVoting, setIsVoting] = useState(false);

    // If user voted, show results immediately
    const hasVoted = !!poll?.user_voted_option_id;

    const handleVote = async (optionId: number) => {
        if (!poll || hasVoted || isVoting) return;

        setIsVoting(true);

        // Optimistic Update
        const newTotal = poll.total_votes + 1;
        const newOptions = poll.options.map(opt => {
            if (opt.id === optionId) {
                return {
                    ...opt,
                    vote_count: opt.vote_count + 1,
                    percent: Math.round(((opt.vote_count + 1) / newTotal) * 100)
                };
            }
            return {
                ...opt,
                percent: Math.round((opt.vote_count / newTotal) * 100)
            };
        });

        // Recalculate other percents to ensure ~100% total (simplified)

        setPoll({
            ...poll,
            options: newOptions,
            total_votes: newTotal,
            user_voted_option_id: optionId
        });

        // Server Call
        const res = await votePoll(poll.id, optionId);
        if (!res.success) {
            alert(res.message);
            // Revert on failure (omitted for brevity in MVP)
        }

        setIsVoting(false);
    };

    if (!poll) return null;

    return (
        <section className="bg-bg-card rounded-[32px] p-6 mb-24 relative overflow-hidden border border-[#333]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="bg-bg-input text-petudy-lime text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        LIVE
                    </span>
                    <h2 className="text-xl font-bold text-white leading-tight flex items-center gap-1">
                        오늘의 펫픽 <Sparkles className="w-4 h-4 text-yellow-400" />
                    </h2>
                </div>
                <span className="text-xs text-gray-500">{poll.total_votes.toLocaleString()}명 참여 중</span>
            </div>

            <h3 className="text-lg text-gray-200 font-medium mb-6 text-center">
                {poll.title}
            </h3>

            {/* VS Container */}
            <div className="flex gap-3 h-48 relative">
                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 flex items-center justify-center font-black text-petudy-lime italic shadow-xl">
                    VS
                </div>

                {poll.options.map((option, idx) => {
                    const isSelected = poll.user_voted_option_id === option.id;
                    const isWinner = hasVoted && (option.percent || 0) >= 50; // Simple winner check

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            className={`flex-1 relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ease-out
                                ${hasVoted ? 'pointer-events-none' : 'active:scale-95 hover:shadow-[0_0_15px_rgba(163,223,70,0.3)]'}
                            `}
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0 bg-gray-800">
                                {option.image_url ? (
                                    <Image
                                        src={option.image_url}
                                        alt={option.text}
                                        fill
                                        className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                        {idx === 0 ? "🅰️" : "🅱️"}
                                    </div>
                                )}
                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${hasVoted ? 'opacity-90' : 'opacity-60 group-hover:opacity-40'}`} />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-3 z-10 flex flex-col items-center">
                                <span className={`text-sm font-bold text-white mb-1 transition-all ${isSelected ? 'text-petudy-lime scale-110' : ''}`}>
                                    {option.text}
                                </span>

                                {/* Result Bar & Percent */}
                                {hasVoted && (
                                    <div className="w-full space-y-1 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                        <div className="flex justify-between items-end px-1">
                                            <span className={`text-2xl font-black italic ${isWinner ? 'text-petudy-lime' : 'text-gray-400'}`}>
                                                {option.percent}%
                                            </span>
                                            {isSelected && <Check className="w-4 h-4 text-petudy-lime mb-1.5" />}
                                        </div>
                                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-petudy-lime' : 'bg-gray-500'}`}
                                                style={{ width: `${option.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selection Effect Ring */}
                            {isSelected && (
                                <div className="absolute inset-0 border-4 border-petudy-lime rounded-2xl animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Action */}
            <div className="mt-4 flex justify-between items-center px-1">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>댓글 달기</span>
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>공유</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
