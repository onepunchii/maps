import { getPolls } from "@/actions/poll";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import PetPickWidget from "@/components/home/PetPickWidget";

export const dynamic = "force-dynamic";

export default async function PollListPage() {
    const polls = await getPolls(50, 0); // Fetch latest 50 polls

    return (
        <div className="min-h-screen bg-bg-main text-white relative">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
                    펫픽 커뮤니티
                </h1>
            </header>

            {/* Content */}
            <div className="p-6 space-y-8 pb-32">
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">진행 중인 투표 🔥</h2>
                    <p className="text-gray-400 text-sm">
                        다른 보호자님들의 고민을 해결해주세요!
                    </p>
                </div>

                <div className="space-y-6">
                    {polls.length > 0 ? (
                        polls.map((poll) => (
                            <PetPickWidget key={poll.id} initialPoll={poll} />
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-500">
                            진행 중인 투표가 없습니다.<br />
                            첫 번째 투표를 만들어보세요!
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href="/community/petpick/create">
                    <button className="w-14 h-14 bg-petudy-lime rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(163,223,70,0.5)] active:scale-95 transition-transform">
                        <Plus className="w-7 h-7 text-bg-main" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
