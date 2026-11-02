import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { client } from "@/lib/db";

const studiosCollection = () => client.db("studiospace").collection("studios");

async function getSessionUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
}

function parseId(id: string): ObjectId | null {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getSessionUser();
        if (!user?.email) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const objectId = parseId(id);
        if (!objectId) {
            return Response.json({ success: false, error: "Invalid listing id" }, { status: 400 });
        }

        const studio = await studiosCollection().findOne({ _id: objectId });
        if (!studio) {
            return Response.json({ success: false, error: "Listing not found" }, { status: 404 });
        }
        if (studio.ownerEmail !== user.email) {
            return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        return Response.json({ success: true, studio });
    } catch (error) {
        console.error("GET /api/studios/[id] failed:", error);
        return Response.json({ success: false, error: "Failed to load listing" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getSessionUser();
        if (!user?.email) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const objectId = parseId(id);
        if (!objectId) {
            return Response.json({ success: false, error: "Invalid listing id" }, { status: 400 });
        }

        const existing = await studiosCollection().findOne({ _id: objectId });
        if (!existing) {
            return Response.json({ success: false, error: "Listing not found" }, { status: 404 });
        }
        if (existing.ownerEmail !== user.email) {
            return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const updates: Record<string, unknown> = {};

        const strings = ["title", "category", "location", "image", "overview"] as const;
        for (const key of strings) {
            if (key in body) {
                const value = typeof body[key] === "string" ? body[key].trim() : "";
                if (!value) {
                    return Response.json({ success: false, error: `${key} cannot be empty` }, { status: 400 });
                }
                updates[key] = value;
            }
        }

        if ("hourlyRate" in body) {
            const rate = Number(body.hourlyRate);
            if (!Number.isFinite(rate) || rate <= 0) {
                return Response.json({ success: false, error: "Hourly rate must be greater than 0" }, { status: 400 });
            }
            updates.hourlyRate = rate;
        }

        if ("securityDeposit" in body) {
            const deposit = Number(body.securityDeposit);
            if (!Number.isFinite(deposit) || deposit < 0) {
                return Response.json({ success: false, error: "Security deposit cannot be negative" }, { status: 400 });
            }
            updates.securityDeposit = deposit;
        }

        if ("maxCapacity" in body) {
            const capacity = Number(body.maxCapacity);
            if (!Number.isFinite(capacity) || capacity < 1) {
                return Response.json({ success: false, error: "Max capacity must be at least 1" }, { status: 400 });
            }
            updates.maxCapacity = Math.floor(capacity);
        }

        if ("amenities" in body) {
            updates.amenities = Array.isArray(body.amenities)
                ? body.amenities.filter((a: unknown): a is string => typeof a === "string")
                : [];
        }

        if (Object.keys(updates).length === 0) {
            return Response.json({ success: false, error: "No valid fields to update" }, { status: 400 });
        }

        updates.updatedAt = new Date().toISOString();

        await studiosCollection().updateOne({ _id: objectId }, { $set: updates });

        return Response.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/studios/[id] failed:", error);
        return Response.json({ success: false, error: "Failed to update listing" }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getSessionUser();
        if (!user?.email) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const objectId = parseId(id);
        if (!objectId) {
            return Response.json({ success: false, error: "Invalid listing id" }, { status: 400 });
        }

        const existing = await studiosCollection().findOne({ _id: objectId });
        if (!existing) {
            return Response.json({ success: false, error: "Listing not found" }, { status: 404 });
        }
        if (existing.ownerEmail !== user.email) {
            return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        await studiosCollection().deleteOne({ _id: objectId });

        return Response.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/studios/[id] failed:", error);
        return Response.json({ success: false, error: "Failed to delete listing" }, { status: 500 });
    }
}
