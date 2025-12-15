"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithKakao() {
    const supabase = await createClient();
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = headersList.get("origin") || `${protocol}://${host}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error);
        throw error;
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = headersList.get("origin") || `${protocol}://${host}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error);
        throw error;
    }

    if (data.url) {
        redirect(data.url);
    }
}
