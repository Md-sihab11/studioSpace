import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { client } from "@/lib/db";

const studiosCollection = () => client.db("studiospace").collection("studios");

async function getSessionUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
}

export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user?.email) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const requestedEmail = request.nextUrl.searchParams.get("email");
        if (requestedEmail && requestedEmail !== user.email) {
            return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const studios = await studiosCollection()
            .find({ ownerEmail: user.email })
            .sort({ createdAt: -1 })
            .toArray();

        return Response.json({ success: true, studios });
    } catch (error) {
        console.error("GET /api/studios failed:", error);
        return Response.json({ success: false, error: "Failed to load listings" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user?.email) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const title = typeof body.title === "string" ? body.title.trim() : "";
        const category = typeof body.category === "string" ? body.category.trim() : "";
        const location = typeof body.location === "string" ? body.location.trim() : "";
        const image = typeof body.image === "string" ? body.image.trim() : "";
        const overview = typeof body.overview === "string" ? body.overview.trim() : "";
        const hourlyRate = Number(body.hourlyRate);
        const securityDeposit = Number(body.securityDeposit || 0);
        const maxCapacity = Number(body.maxCapacity);
        const amenities = Array.isArray(body.amenities)
            ? body.amenities.filter((a: unknown): a is string => typeof a === "string")
            : [];

        if (!title || !category || !location || !image || !overview) {
            return Response.json(
                { success: false, error: "Title, category, location, image and overview are required" },
                { status: 400 }
            );
        }
        if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
            return Response.json({ success: false, error: "Hourly rate must be greater than 0" }, { status: 400 });
        }
        if (!Number.isFinite(securityDeposit) || securityDeposit < 0) {
            return Response.json({ success: false, error: "Security deposit cannot be negative" }, { status: 400 });
        }
        if (!Number.isFinite(maxCapacity) || maxCapacity < 1) {
            return Response.json({ success: false, error: "Max capacity must be at least 1" }, { status: 400 });
        }

        const now = new Date().toISOString();
        const result = await studiosCollection().insertOne({
            title,
            category,
            hourlyRate,
            securityDeposit,
            maxCapacity: Math.floor(maxCapacity),
            location,
            image,
            amenities,
            overview,
            ownerEmail: user.email,
            ownerName: user.name ?? "",
            rating: 0,
            reviews: 0,
            createdAt: now,
            updatedAt: now,
        });

        return Response.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
    } catch (error) {
        console.error("POST /api/studios failed:", error);
        return Response.json({ success: false, error: "Failed to save listing" }, { status: 500 });
    }
}
