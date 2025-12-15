"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { pets } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";

const petSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['dog', 'cat']),
    breed: z.string().min(1),
    gender: z.enum(['MALE', 'FEMALE']),
    neutered: z.enum(['Y', 'N', 'UNKNOWN']),
    birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    regStatus: z.enum(['Y', 'N']).default('N'),
    weight: z.string().optional().transform(val => val ? val : null), // Keep as string for decimal
    specifics: z.string().optional(),
});

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function addPetAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const rawData = {
        name: formData.get("name"),
        type: formData.get("type"),
        breed: formData.get("breed"),
        gender: formData.get("gender"),
        neutered: formData.get("neutered"),
        birthDate: formData.get("birthDate"),
        regStatus: formData.get("regStatus") || 'N',
        weight: formData.get("weight"),
        specifics: formData.get("specifics"),
    };

    const validated = petSchema.safeParse(rawData);

    if (!validated.success) {
        console.error(validated.error);
        return { success: false, error: "Invalid data" };
    }

    await db.insert(pets).values({
        userId: user.id,
        petName: validated.data.name,
        species: validated.data.type === 'dog' ? 'DOG' : 'CAT',
        breed: validated.data.breed,
        gender: validated.data.gender as "MALE" | "FEMALE",
        neutered: validated.data.neutered as "Y" | "N" | "UNKNOWN",
        birthDate: validated.data.birthDate,
        regStatus: validated.data.regStatus as "Y" | "N",
        weightKg: validated.data.weight, // Drizzle handles string -> decimal
        healthConcerns: validated.data.specifics || null,
        // Default values for others
        profilePhotoUrl: null,
    });

    revalidatePath("/mypage");
    return { success: true };
}

export async function deletePetAction(petId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Verify ownership
    const pet = await db.query.pets.findFirst({
        where: (p, { eq, and }) => and(eq(p.id, petId), eq(p.userId, user.id)),
    });

    if (!pet) return; // Not found or not owner

    await db.delete(pets).where(eq(pets.id, petId));
    revalidatePath("/mypage");
}
