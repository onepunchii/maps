import PetSettingsPage from "@/components/settings/PetSettingsPage";
import { getPets } from "@/actions/pet";

export default async function Page() {
    const pets = await getPets();
    return <PetSettingsPage initialPets={pets} />;
}
