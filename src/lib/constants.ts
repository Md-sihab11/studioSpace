export const STUDIO_CATEGORIES = [
    "Photo Studio",
    "Film Stage",
    "Podcast Lounge",
    "Music Suite",
    "Workshop",
    "Rehearsal Space",
    "Art Studio",
] as const;

export const AMENITIES = [
    "Wi-Fi",
    "Parking",
    "Green Screen",
    "Lighting Kit",
    "Soundproofing",
    "Makeup Area",
    "Projector",
    "Kitchen",
    "Restroom",
    "24/7 Access",
    "Loading Dock",
    "Client Lounge",
] as const;

export type Studio = {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit: number;
    maxCapacity: number;
    location: string;
    image: string;
    amenities: string[];
    overview: string;
    ownerEmail: string;
    ownerName: string;
    rating: number;
    reviews: number;
    createdAt: string;
    updatedAt: string;
};
