
import dogDataRaw from "./dog.json";
import catDataRaw from "./cat.json";

export type PetTrait = {
    level: number; // 1-5
    description?: string;
};

export type PetBreedData = {
    id: string;
    species: "dog" | "cat";
    name: string;
    description: string;
    origin: string; // 원산지
    traits: {
        size: number;        // 크기 (C)
        shedding: number;    // 털빠짐 (D)
        friendliness: number;// 친화력 (E)
        trainability: number;// 학습력 (F)
        energy: number;      // 실내외/활동량 (G)
    };
    imageUrl?: string; // (I)
};

// Helper to parse numeric string safely
const parseScore = (val: string | number): number => {
    if (typeof val === "number") return val;
    const num = parseInt(val, 10);
    return isNaN(num) ? 3 : num; // Default to middle if missing
};

// Type definition for the raw JSON structure (based on A, B, C keys)
type RawPetData = {
    A: string; // Name
    B: string; // Origin
    C: string; // Size
    D: string; // Shedding
    E: string; // Friendliness
    F: string; // Trainability
    G: string; // Energy
    H: string; // Summary
    I: string; // Image
};

// Filter out the header row (where A === "견종" or "묘종") and map
const processData = (data: any[], species: "dog" | "cat"): PetBreedData[] => {
    return data
        .filter((item: RawPetData) => item.A !== "견종" && item.A !== "묘종" && item.A) // Remove header and empty rows
        .map((item: RawPetData, index) => {
            // Remove brackets from name if present e.g. "말티즈[Maltese]" -> "말티즈"
            const name = item.A.split("[")[0].trim();

            return {
                id: `${species}-${index}`,
                species,
                name: name,
                origin: item.B,
                description: item.H || "",
                traits: {
                    size: parseScore(item.C),
                    shedding: parseScore(item.D),
                    friendliness: parseScore(item.E),
                    trainability: parseScore(item.F),
                    energy: parseScore(item.G),
                },
                imageUrl: item.I
            };
        });
};

export const DOG_BREEDS: PetBreedData[] = processData(dogDataRaw, "dog");
export const CAT_BREEDS: PetBreedData[] = processData(catDataRaw, "cat");

export const ALL_PET_BREEDS = [...DOG_BREEDS, ...CAT_BREEDS];
