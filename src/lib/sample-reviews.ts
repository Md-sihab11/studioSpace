export type SampleReview = {
    id: string;
    name: string;
    rating: number;
    date: string;
    text: string;
};

/**
 * Static demo reviews. The studios collection only stores a numeric
 * `rating` + `reviews` count, so the details page renders these cards
 * alongside the stored summary.
 */
export const SAMPLE_REVIEWS: SampleReview[] = [
    {
        id: "r1",
        name: "Ayesha Rahman",
        rating: 5,
        date: "October 2026",
        text: "Booked the space for a client shoot and everything matched the listing. Natural light in the afternoon is fantastic and the host answered every question within minutes.",
    },
    {
        id: "r2",
        name: "Tanvir Hasan",
        rating: 4,
        date: "September 2026",
        text: "Great acoustics and clean facilities. Setup took a little longer than expected, but the equipment was all in working order. Would book again for our next session.",
    },
    {
        id: "r3",
        name: "Nusrat Jahan",
        rating: 5,
        date: "September 2026",
        text: "Perfect for our podcast recording. Soundproofing genuinely works, the mics were quality, and check-in was seamless. Highly recommend for small teams.",
    },
    {
        id: "r4",
        name: "Rafiul Islam",
        rating: 4,
        date: "August 2026",
        text: "Spacious, well maintained and easy to reach. The security deposit was refunded the same day. Solid choice for workshops and small events.",
    },
];
