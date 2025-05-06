import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating performance reviews
const updatePerformanceReviewSchema = z.object({
  reviewerId: z.string().optional(),
  reviewDate: z.string().transform(str => new Date(str)).optional(),
  periodStartDate: z.string().transform(str => new Date(str)).optional(),
  periodEndDate: z.string().transform(str => new Date(str)).optional(),
  rating: z.enum([
    "POOR", 
    "NEEDS_IMPROVEMENT", 
    "MEETS_EXPECTATIONS", 
    "EXCEEDS_EXPECTATIONS", 
    "OUTSTANDING"
  ]).optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  goals: z.string().optional(),
  comments: z.string().optional(),
});

// GET /api/rh/performance/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const performanceReview = await prisma.performanceReview.findUnique({
      where: { id: params.id },
      include: {
        employee: {
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
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
          },
        },
      },
    });

    if (!performanceReview) {
      return NextResponse.json(
        { error: "Performance review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(performanceReview);
  } catch (error) {
    console.error("Error fetching performance review:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance review" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/performance/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the performance review exists
    const existingReview = await prisma.performanceReview.findUnique({
      where: { id: params.id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Performance review not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updatePerformanceReviewSchema.parse(body);

    // Update the performance review
    const updatedReview = await prisma.performanceReview.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        employee: {
          select: {
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating performance review:", error);
    return NextResponse.json(
      { error: "Failed to update performance review" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/performance/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the performance review exists
    const existingReview = await prisma.performanceReview.findUnique({
      where: { id: params.id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Performance review not found" },
        { status: 404 }
      );
    }

    // Delete the performance review
    await prisma.performanceReview.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Performance review deleted successfully" });
  } catch (error) {
    console.error("Error deleting performance review:", error);
    return NextResponse.json(
      { error: "Failed to delete performance review" },
      { status: 500 }
    );
  }
}
