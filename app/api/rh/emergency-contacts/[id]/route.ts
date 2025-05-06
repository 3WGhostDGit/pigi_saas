import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating emergency contacts
const updateEmergencyContactSchema = z.object({
  name: z.string().min(1).optional(),
  relationship: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  isPrimary: z.boolean().optional(),
});

// GET /api/rh/emergency-contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emergencyContact = await prisma.emergencyContact.findUnique({
      where: { id: params.id },
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
    });

    if (!emergencyContact) {
      return NextResponse.json(
        { error: "Emergency contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(emergencyContact);
  } catch (error) {
    console.error("Error fetching emergency contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch emergency contact" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/emergency-contacts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the emergency contact exists
    const existingContact = await prisma.emergencyContact.findUnique({
      where: { id: params.id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Emergency contact not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateEmergencyContactSchema.parse(body);

    // If this is being set as a primary contact, update any existing primary contacts
    if (validatedData.isPrimary && !existingContact.isPrimary) {
      await prisma.emergencyContact.updateMany({
        where: {
          userId: existingContact.userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Update the emergency contact
    const updatedContact = await prisma.emergencyContact.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating emergency contact:", error);
    return NextResponse.json(
      { error: "Failed to update emergency contact" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/emergency-contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the emergency contact exists
    const existingContact = await prisma.emergencyContact.findUnique({
      where: { id: params.id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: "Emergency contact not found" },
        { status: 404 }
      );
    }

    // Delete the emergency contact
    await prisma.emergencyContact.delete({
      where: { id: params.id },
    });

    // If this was a primary contact and there are other contacts, make one of them primary
    if (existingContact.isPrimary) {
      const otherContact = await prisma.emergencyContact.findFirst({
        where: {
          userId: existingContact.userId,
        },
      });

      if (otherContact) {
        await prisma.emergencyContact.update({
          where: { id: otherContact.id },
          data: {
            isPrimary: true,
          },
        });
      }
    }

    return NextResponse.json({ message: "Emergency contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    return NextResponse.json(
      { error: "Failed to delete emergency contact" },
      { status: 500 }
    );
  }
}
