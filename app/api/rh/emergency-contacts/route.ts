import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating emergency contacts
const emergencyContactSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// GET /api/rh/emergency-contacts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const isPrimary = url.searchParams.get("isPrimary") === "true";

    // Build query filters
    const filters: any = {};
    
    if (userId) {
      filters.userId = userId;
    }
    
    if (isPrimary) {
      filters.isPrimary = true;
    }

    // Fetch emergency contacts
    const emergencyContacts = await prisma.emergencyContact.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          isPrimary: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json(emergencyContacts);
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch emergency contacts" },
      { status: 500 }
    );
  }
}

// POST /api/rh/emergency-contacts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = emergencyContactSchema.parse(body);

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If this is a primary contact, update any existing primary contacts
    if (validatedData.isPrimary) {
      await prisma.emergencyContact.updateMany({
        where: {
          userId: validatedData.userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create new emergency contact
    const emergencyContact = await prisma.emergencyContact.create({
      data: {
        userId: validatedData.userId,
        name: validatedData.name,
        relationship: validatedData.relationship,
        phone: validatedData.phone,
        email: validatedData.email,
        address: validatedData.address,
        isPrimary: validatedData.isPrimary,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(emergencyContact, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating emergency contact:", error);
    return NextResponse.json(
      { error: "Failed to create emergency contact" },
      { status: 500 }
    );
  }
}
