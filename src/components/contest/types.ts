export interface ContestEntry {
    id: number;
    petName: string;
    ownerName: string;
    imageUrl: string;
    caption: string;
    voteCount: number;
    rank?: number;
    userId?: string;
}

export interface Contest {
    id: number;
    title: string;
    description: string;
    bannerImage: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}
