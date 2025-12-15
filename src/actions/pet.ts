"use server";

import { createClient } from "@/lib/supabase/server";

export interface Pet {
    id: string;
    name: string;
    photo_url: string | null; // DB column snake_case usually
    gender: "male" | "female";
    breed: string | null;
    birth_date: string | null;
    concerns: string[] | null; // assuming jsonb or array
    species: string | null;
    registration_number: string | null;
    neuter: boolean | null;
}

export async function getPets() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching pets:", error);
        return [];
    }

    return data as Pet[];
}
