import { getPet } from "@/actions/pet";
import RegistrationWizard from "@/components/register/RegistrationWizard";
import { redirect } from "next/navigation";

export default async function EditPetPage({ params }: { params: { id: string } }) {
    const pet = await getPet(params.id);

    if (!pet) {
        redirect("/settings/pets");
    }

    // Transform Pet to PetFormData
    // Note: Some fields like weight, color, adoptionDate might be missing in 'Pet' interface but exist in DB. 
    // For now, mapping what we have in 'Pet' interface.
    // Ideally 'getPet' should return full DB fields if we want to edit them all.
    // Assuming 'Pet' interface in actions/pet.ts is limited for display.
    // For editing, we might need a fuller object or just accept what's there.
    // Let's rely on what we have.

    const initialData = {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        neuter: pet.neuter ? "yes" : "no",
        birth: pet.birth_date,
        concern: pet.concerns,
        photo: pet.photo_url,
        reg_number: pet.registration_number,
        weight: pet.weight,
        color: pet.color,
        adoptionDate: pet.adoption_date
    };

    return (
        <div className="min-h-screen bg-black">
            {/* We can reuse the wizard or wrap it. 
                 The wizard has its own layout/header, so we just render it. 
             */}
            <RegistrationWizard
                initialData={initialData}
                isEditMode={true}
                petId={pet.id}
            />
        </div>
    );
}
