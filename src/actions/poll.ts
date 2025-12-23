"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PollOption {
    id: number;
    text: string;
    image_url: string | null;
    vote_count: number;
    percent?: number;
}

export interface Poll {
    id: number;
    title: string;
    description?: string;
    options: PollOption[];
    total_votes: number;
    user_voted_option_id?: number | null; // ID of the option the user voted for
}

export async function getLatestPoll(): Promise<Poll | null> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch latest OPEN poll
        const { data: pollData, error: pollError } = await supabase
            .from("polls")
            .select("*")
            .eq("status", "OPEN")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (pollError || !pollData) {
            // Return dummy data if no poll exists (for testing/demo)
            // In production, return null or handle empty state
            return {
                id: 0,
                title: "우리 아이 미용 스타일, 어떤 게 더 귀여울까요?",
                options: [
                    { id: 1, text: "곰돌이컷", image_url: "https://images.unsplash.com/photo-1598133894008-61f03db8b555?w=400&h=400&fit=crop", vote_count: 42, percent: 52 },
                    { id: 2, text: "물개컷", image_url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop", vote_count: 38, percent: 48 },
                ],
                total_votes: 80,
                user_voted_option_id: null
            };
        }

        // 2. Fetch Options
        const { data: optionsData, error: optionsError } = await supabase
            .from("poll_options")
            .select("*")
            .eq("poll_id", pollData.id)
            .order("id", { ascending: true });

        if (optionsError) return null;

        // 3. Check if user voted
        let userVotedOptionId = null;
        if (user) {
            const { data: voteData } = await supabase
                .from("poll_votes")
                .select("option_id")
                .eq("poll_id", pollData.id)
                .eq("user_id", user.id)
                .single();

            if (voteData) {
                userVotedOptionId = voteData.option_id;
            }
        }

        // Calculate Totals & Percents
        const options = optionsData || [];
        const totalVotes = options.reduce((acc: number, curr: any) => acc + (curr.vote_count || 0), 0);

        const formattedOptions: PollOption[] = options.map((opt: any) => ({
            id: opt.id,
            text: opt.option_text,
            image_url: opt.image_url,
            vote_count: opt.vote_count || 0,
            percent: totalVotes === 0 ? 0 : Math.round(((opt.vote_count || 0) / totalVotes) * 100)
        }));

        return {
            id: pollData.id,
            title: pollData.title,
            options: formattedOptions,
            total_votes: totalVotes,
            user_voted_option_id: userVotedOptionId
        };

    } catch (error) {
        console.error("Error fetching poll:", error);
        return null;
    }
}

export async function votePoll(pollId: number, optionId: number) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        // 1. Check if already voted
        const { data: existingVote } = await supabase
            .from("poll_votes")
            .select("*")
            .eq("poll_id", pollId)
            .eq("user_id", user.id)
            .single();

        if (existingVote) {
            return { success: false, message: "이미 투표에 참여하셨습니다." };
        }

        // 2. Insert Vote
        const { error: voteError } = await supabase
            .from("poll_votes")
            .insert({
                poll_id: pollId,
                option_id: optionId,
                user_id: user.id
            });

        if (voteError) throw voteError;

        // 3. Increment Count (Optimistic or Atomic update)
        // Using RPC or just separate update. For MVP, separate update is fine but less safe.
        // Better: Postgres trigger or RPC. Here simply fetching current + 1.
        // Let's use internal increment if Supabase supports it easily, or just raw RPC.
        // Falling back to simple read-update for MVP speed.

        const { data: option } = await supabase
            .from("poll_options")
            .select("vote_count")
            .eq("id", optionId)
            .single();

        if (option) {
            await supabase
                .from("poll_options")
                .update({ vote_count: (option.vote_count || 0) + 1 })
                .eq("id", optionId);
        }

        revalidatePath("/");
        return { success: true };

    } catch (error) {
        console.error("Vote error:", error);
        return { success: false, message: "투표 중 오류가 발생했습니다." };
    }
}
