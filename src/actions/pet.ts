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


import { pets } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

// Type definition for incoming form data
export interface PetFormData {
    name: string;
    species: "dog" | "cat";
    breed: string | null;
    gender: "male" | "female";
    neuter: "yes" | "no";
    birth: string | null; // "YYYY-MM-DD"
    weight: string | null;
    color: string | null;
    concern: string[] | null;
    photo: string | null;
    reg_number: string | null;
    adoptionDate: string | null;
}

export async function createPet(formData: PetFormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error("User not authenticated");
        }

        // Convert Frontend values to DB Enum format
        // Species: dog -> DOG
        const dbSpecies = formData.species === "cat" ? "CAT" : "DOG";

        // Gender: male -> MALE
        const dbGender = formData.gender === "female" ? "FEMALE" : "MALE";

        // Neutered: yes -> Y, no -> N
        const dbNeutered = formData.neuter === "yes" ? "Y" : "N";

        // Reg Status: has reg_number ? Y : N
        const dbRegStatus = formData.reg_number ? "Y" : "N";

        // Insert into DB
        await supabase.from("pets").insert({
            user_id: user.id,
            pet_name: formData.name,
            species: dbSpecies,
            breed: formData.breed || "믹스",
            gender: dbGender,
            neutered: dbNeutered,
            birth_date: formData.birth, // Postgres accepts YYYY-MM-DD string
            adoption_date: formData.adoptionDate,
            weight_kg: formData.weight ? parseFloat(formData.weight) : null,
            fur_color: formData.color,
            health_concerns: formData.concern ? formData.concern.join(",") : null, // Storing array as comma-separated string for text column
            profile_photo_url: formData.photo,
            reg_status: dbRegStatus,
            reg_num: formData.reg_number
        });

        // Revalidate paths to update UI
        revalidatePath("/");
        revalidatePath("/mypage");

        return { success: true };
    } catch (error) {
        console.error("Failed to create pet:", error);
        throw error;
    }
}

export async function getPets() {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
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


        return data.map((pet: any) => ({
            id: pet.id,
            name: pet.pet_name,
            photo_url: pet.profile_photo_url,
            gender: pet.gender === "MALE" ? "male" : "female",
            breed: pet.breed,
            birth_date: pet.birth_date,
            concerns: pet.health_concerns ? pet.health_concerns.split(",") : [],
            species: pet.species === "CAT" ? "cat" : "dog",
            registration_number: pet.reg_num,
            neuter: pet.neutered === "Y"
        })) as Pet[];
    } catch (error) {
        console.error("Unexpected error in getPets:", error);
        return [];
    }
}

export async function getPet(petId: string) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return null;

        const { data, error } = await supabase
            .from("pets")
            .select("*")
            .eq("id", petId)
            .eq("user_id", user.id)
            .single();

        if (error || !data) return null;

        const pet = data;
        return {
            id: pet.id,
            name: pet.pet_name,
            photo_url: pet.profile_photo_url,
            gender: pet.gender === "MALE" ? "male" : "female",
            breed: pet.breed,
            birth_date: pet.birth_date,
            concerns: pet.health_concerns ? pet.health_concerns.split(",") : [],
            species: pet.species === "CAT" ? "cat" : "dog",
            registration_number: pet.reg_num,
            neuter: pet.neutered === "Y"
        } as Pet;
    } catch (error) {
        console.error("Error fetching pet:", error);
        return null;
    }
}

export async function updatePet(petId: string, formData: PetFormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) throw new Error("Unauthorized");

        const dbSpecies = formData.species === "cat" ? "CAT" : "DOG";
        const dbGender = formData.gender === "female" ? "FEMALE" : "MALE";
        const dbNeutered = formData.neuter === "yes" ? "Y" : "N";
        const dbRegStatus = formData.reg_number ? "Y" : "N";

        const { error } = await supabase
            .from("pets")
            .update({
                pet_name: formData.name,
                species: dbSpecies,
                breed: formData.breed || "믹스",
                gender: dbGender,
                neutered: dbNeutered,
                birth_date: formData.birth,
                adoption_date: formData.adoptionDate,
                weight_kg: formData.weight ? parseFloat(formData.weight) : null,
                fur_color: formData.color,
                health_concerns: formData.concern ? formData.concern.join(",") : null,
                profile_photo_url: formData.photo,
                reg_status: dbRegStatus,
                reg_num: formData.reg_number
            })
            .eq("id", petId)
            .eq("user_id", user.id);

        if (error) throw error;

        revalidatePath("/");
        revalidatePath("/mypage");
        revalidatePath(`/settings/pets/${petId}/edit`);

        return { success: true };
    } catch (error) {
        console.error("Failed to update pet:", error);
        throw error;
    }
}
