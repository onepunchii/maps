"use client";

import { useState, useEffect } from "react";
import { Check, MessageCircle, Share2 } from "lucide-react";
import { Poll, votePoll, getNextPoll } from "@/actions/poll";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import PollCommentSheet from "../poll/PollCommentSheet";

interface PetPickWidgetProps {
    initialPoll: Poll | null;
    showStar?: boolean;
    enableAutoNext?: boolean;
}

export default function PetPickWidget({ initialPoll, showStar = true, enableAutoNext = true }: PetPickWidgetProps) {
    const [poll, setPoll] = useState<Poll | null>(initialPoll);
    const [isVoting, setIsVoting] = useState(false);
    const [viewedPollIds, setViewedPollIds] = useState<number[]>([]);
    const [isCommentOpen, setIsCommentOpen] = useState(false);

    useEffect(() => {
        if (initialPoll) {
            setViewedPollIds([initialPoll.id]);
        }
    }, [initialPoll]);

    const hasVoted = !!poll?.user_voted_option_id;

    const handleVote = async (optionId: number) => {
        if (!poll || hasVoted || isVoting) return;

        setIsVoting(true);

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

        setPoll({
            ...poll,
            options: newOptions,
            total_votes: newTotal,
            user_voted_option_id: optionId
        });

        const res = await votePoll(poll.id, optionId);
        if (!res.success) {
            console.error(res.message);
        }

        if (enableAutoNext) {
            setTimeout(async () => {
                const nextPoll = await getNextPoll(viewedPollIds);

                if (nextPoll) {
                    setPoll(nextPoll);
                    setViewedPollIds(prev => [...prev, nextPoll.id]);
                    setIsVoting(false);
                } else {
                    setIsVoting(false);
                }
            }, 2000);
        } else {
            setIsVoting(false);
        }
    };

    const handleShare = async () => {
        if (!poll) return;
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: poll.title,
                    text: '이 펫픽에 투표해주세요!',
                    url: url,
                });
            } catch (err) {
                console.log('Share canceled', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert("링크가 복사되었습니다!");
            } catch (err) {
                console.error("Copy failed", err);
            }
        }
    };

    if (!poll) return null;

    return (
        <section className={`bg-bg-card rounded-[32px] p-6 relative overflow-hidden border ${hasVoted ? 'border-petudy-lime' : 'border-[#333]'} transition-colors duration-500`}>
            {hasVoted && (
                <div className="absolute top-0 right-0 bg-petudy-lime text-black font-bold text-xs px-3 py-1.5 rounded-bl-2xl z-30 flex items-center gap-1 animate-in fade-in slide-in-from-top-2">
                    <Check className="w-3 h-3" />
                    참여완료
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="bg-bg-input text-petudy-lime text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        LIVE
                    </span>
                    <h2 className="text-xl font-bold text-white leading-tight flex items-center gap-1">
                        오늘의 펫픽
                        {showStar && (
                            <div className="w-[60px] h-[60px] -my-4 flex items-center justify-center">
                                <DotLottieReact
                                    src="https://lottie.host/ef31ea2f-3a6a-4176-be9c-146569cc637f/t4OeWfqFOd.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                        )}
                    </h2>
                </div>
                <span className="text-xs text-gray-500">{poll.total_votes.toLocaleString()}명 참여 중</span>
            </div>

            <div key={poll.id} className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg text-gray-200 font-medium mb-6 text-center">
                    {poll.title}
                </h3>

                <div className="flex flex-col gap-2">
                    {poll.options.map((option, idx) => {
                        const isSelected = poll.user_voted_option_id === option.id;
                        const percent = option.percent || 0;
                        const letter = String.fromCharCode(65 + idx);

                        return (
                            <div
                                key={option.id}
                                onClick={() => handleVote(option.id)}
                                className={`relative w-full p-4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border
                                    ${isSelected
                                        ? 'border-petudy-lime bg-petudy-lime/10'
                                        : 'border-white/10 bg-[#2c2c2e] hover:bg-[#3a3a3c] active:scale-98'
                                    }
                                    ${hasVoted ? 'pointer-events-none' : ''}
                                `}
                            >
                                <div className="relative z-10 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                        ${isSelected ? 'bg-petudy-lime text-black' : 'bg-white/10 text-gray-400'}
                                    `}>
                                        {letter}
                                    </div>

                                    <span className={`flex-1 font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                        {option.text}
                                    </span>

                                    {hasVoted && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-400">{percent}%</span>
                                            {isSelected && <Check className="w-4 h-4 text-petudy-lime" />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center px-1">
                <button
                    onClick={() => setIsCommentOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>댓글 달기</span>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>공유</span>
                    </button>
                </div>
            </div>

            <PollCommentSheet
                pollId={poll.id}
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
            />
        </section>
    );
}
