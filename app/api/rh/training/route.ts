import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating training programs
const trainingSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  provider: z.string().optional(),
  duration: z.number().int().optional(),
  cost: z.number().optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  isMandatory: z.boolean().default(false),
});

// Schema for creating/updating employee training enrollments
const employeeTrainingSchema = z.object({
  userId: z.string(),
  trainingId: z.string(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "FAILED"]).default("PLANNED"),
  completionDate: z.string().transform(str => new Date(str)).optional(),
  score: z.number().optional(),
  certificateUrl: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/rh/training
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "programs"; // Default to programs
    const userId = url.searchParams.get("userId");
    const trainingId = url.searchParams.get("trainingId");
    const status = url.searchParams.get("status");
    const isMandatory = url.searchParams.get("isMandatory");

    if (type === "programs") {
      // Build query filters for training programs
      const filters: any = {};
      
      if (isMandatory === "true") {
        filters.isMandatory = true;
      } else if (isMandatory === "false") {
        filters.isMandatory = false;
      }

      // Fetch training programs
      const trainings = await prisma.training.findMany({
        where: filters,
        include: {
          _count: {
            select: {
              employeeTrainings: true,
            },
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      return NextResponse.json(trainings);
    } else if (type === "enrollments") {
      // Build query filters for employee trainings
      const filters: any = {};
      
      if (userId) {
        filters.userId = userId;
      }
      
      if (trainingId) {
        filters.trainingId = trainingId;
      }
      
      if (status) {
        filters.status = status;
      }

      // Fetch employee training enrollments
      const employeeTrainings = await prisma.employeeTraining.findMany({
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
          training: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(employeeTrainings);
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'programs' or 'enrollments'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching training data:", error);
    return NextResponse.json(
      { error: "Failed to fetch training data" },
      { status: 500 }
    );
  }
}

// POST /api/rh/training
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "programs"; // Default to programs

    const body = await request.json();

    if (type === "programs") {
      const validatedData = trainingSchema.parse(body);

      // Create new training program
      const training = await prisma.training.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          provider: validatedData.provider,
          duration: validatedData.duration,
          cost: validatedData.cost,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          isMandatory: validatedData.isMandatory,
        },
      });

      return NextResponse.json(training, { status: 201 });
    } else if (type === "enrollments") {
      const validatedData = employeeTrainingSchema.parse(body);

      // Check if the user and training exist
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId },
      });

      const training = await prisma.training.findUnique({
        where: { id: validatedData.trainingId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      if (!training) {
        return NextResponse.json(
          { error: "Training program not found" },
          { status: 404 }
        );
      }

      // Check if the user is already enrolled in this training
      const existingEnrollment = await prisma.employeeTraining.findFirst({
        where: {
          userId: validatedData.userId,
          trainingId: validatedData.trainingId,
        },
      });

      if (existingEnrollment) {
        return NextResponse.json(
          { error: "User is already enrolled in this training program" },
          { status: 400 }
        );
      }

      // Create new employee training enrollment
      const enrollment = await prisma.employeeTraining.create({
        data: {
          userId: validatedData.userId,
          trainingId: validatedData.trainingId,
          status: validatedData.status,
          completionDate: validatedData.completionDate,
          score: validatedData.score,
          certificateUrl: validatedData.certificateUrl,
          notes: validatedData.notes,
        },
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

      return NextResponse.json(enrollment, { status: 201 });
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'programs' or 'enrollments'." },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating training data:", error);
    return NextResponse.json(
      { error: "Failed to create training data" },
      { status: 500 }
    );
  }
}
