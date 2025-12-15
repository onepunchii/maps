"use client";

import { useQuery } from "@tanstack/react-query";
import { getPets } from "@/actions/pet";

export function usePets() {
    return useQuery({
        queryKey: ["pets"],
        queryFn: async () => {
            const data = await getPets();
            return data;
        },
    });
}
