import { getPets } from "@/actions/pet";
import HomePageClient from "@/components/home/HomePageClient";

export default async function HomePage() {
    const pets = await getPets();
    return <HomePageClient initialPets={pets} />;
}
