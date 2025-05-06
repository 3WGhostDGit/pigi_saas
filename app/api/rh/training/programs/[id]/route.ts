import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating training programs
const updateTrainingSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  provider: z.string().optional(),
  duration: z.number().int().optional(),
  cost: z.number().optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  isMandatory: z.boolean().optional(),
});

// GET /api/rh/training/programs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const training = await prisma.training.findUnique({
      where: { id: params.id },
      include: {
        employeeTrainings: {
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
        },
        _count: {
          select: {
            employeeTrainings: true,
          },
        },
      },
    });

    if (!training) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error("Error fetching training program:", error);
    return NextResponse.json(
      { error: "Failed to fetch training program" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/training/programs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the training program exists
    const existingTraining = await prisma.training.findUnique({
      where: { id: params.id },
    });

    if (!existingTraining) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateTrainingSchema.parse(body);

    // Update the training program
    const updatedTraining = await prisma.training.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedTraining);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating training program:", error);
    return NextResponse.json(
      { error: "Failed to update training program" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/training/programs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the training program exists
    const existingTraining = await prisma.training.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            employeeTrainings: true,
          },
        },
      },
    });

    if (!existingTraining) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    // Check if there are any enrollments for this training
    if (existingTraining._count.employeeTrainings > 0) {
      return NextResponse.json(
        { error: "Cannot delete training program with active enrollments" },
        { status: 400 }
      );
    }

    // Delete the training program
    await prisma.training.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Training program deleted successfully" });
  } catch (error) {
    console.error("Error deleting training program:", error);
    return NextResponse.json(
      { error: "Failed to delete training program" },
      { status: 500 }
    );
  }
}
