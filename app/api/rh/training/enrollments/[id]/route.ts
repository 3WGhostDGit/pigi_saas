import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating employee training enrollments
const updateEmployeeTrainingSchema = z.object({
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "FAILED"]).optional(),
  completionDate: z.string().transform(str => new Date(str)).optional(),
  score: z.number().optional(),
  certificateUrl: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/rh/training/enrollments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollment = await prisma.employeeTraining.findUnique({
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
        training: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Training enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error fetching training enrollment:", error);
    return NextResponse.json(
      { error: "Failed to fetch training enrollment" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/training/enrollments/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the enrollment exists
    const existingEnrollment = await prisma.employeeTraining.findUnique({
      where: { id: params.id },
    });

    if (!existingEnrollment) {
      return NextResponse.json(
        { error: "Training enrollment not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateEmployeeTrainingSchema.parse(body);

    // Update the enrollment
    const updatedEnrollment = await prisma.employeeTraining.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        training: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating training enrollment:", error);
    return NextResponse.json(
      { error: "Failed to update training enrollment" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/training/enrollments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the enrollment exists
    const existingEnrollment = await prisma.employeeTraining.findUnique({
      where: { id: params.id },
    });

    if (!existingEnrollment) {
      return NextResponse.json(
        { error: "Training enrollment not found" },
        { status: 404 }
      );
    }

    // Delete the enrollment
    await prisma.employeeTraining.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Training enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting training enrollment:", error);
    return NextResponse.json(
      { error: "Failed to delete training enrollment" },
      { status: 500 }
    );
  }
}
