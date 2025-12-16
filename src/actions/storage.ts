"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadPetPhoto(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) throw new Error("No file provided");

        const supabase = await createClient();

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `pets/${fileName}`;

        // Upload to 'pet-photos' bucket
        // If this bucket doesn't exist, we might need to handle creation or use a different one.
        // For now, assuming 'pet-photos' or 'images'. Let's try 'pet-photos'.
        const { error } = await supabase.storage
            .from("pet-photos")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            console.error("Storage upload error:", error);
            throw error;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("pet-photos")
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Upload action failed:", error);
        return { success: false, error: (error as Error).message };
    }
}
