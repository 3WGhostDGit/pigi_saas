import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating performance reviews
const performanceReviewSchema = z.object({
  userId: z.string(),
  reviewerId: z.string(),
  reviewDate: z.string().transform(str => new Date(str)),
  periodStartDate: z.string().transform(str => new Date(str)),
  periodEndDate: z.string().transform(str => new Date(str)),
  rating: z.enum([
    "POOR", 
    "NEEDS_IMPROVEMENT", 
    "MEETS_EXPECTATIONS", 
    "EXCEEDS_EXPECTATIONS", 
    "OUTSTANDING"
  ]),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  goals: z.string().optional(),
  comments: z.string().optional(),
});

// GET /api/rh/performance
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const reviewerId = url.searchParams.get("reviewerId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const rating = url.searchParams.get("rating");

    // Build query filters
    const filters: any = {};
    
    if (userId) {
      filters.userId = userId;
    }
    
    if (reviewerId) {
      filters.reviewerId = reviewerId;
    }
    
    if (rating) {
      filters.rating = rating;
    }
    
    if (startDate || endDate) {
      filters.reviewDate = {};
      
      if (startDate) {
        filters.reviewDate.gte = new Date(startDate);
      }
      
      if (endDate) {
        filters.reviewDate.lte = new Date(endDate);
      }
    }

    // Fetch performance reviews
    const performanceReviews = await prisma.performanceReview.findMany({
      where: filters,
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
      orderBy: {
        reviewDate: 'desc',
      },
    });

    return NextResponse.json(performanceReviews);
  } catch (error) {
    console.error("Error fetching performance reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance reviews" },
      { status: 500 }
    );
  }
}

// POST /api/rh/performance
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = performanceReviewSchema.parse(body);

    // Create new performance review
    const performanceReview = await prisma.performanceReview.create({
      data: {
        userId: validatedData.userId,
        reviewerId: validatedData.reviewerId,
        reviewDate: validatedData.reviewDate,
        periodStartDate: validatedData.periodStartDate,
        periodEndDate: validatedData.periodEndDate,
        rating: validatedData.rating,
        strengths: validatedData.strengths,
        weaknesses: validatedData.weaknesses,
        goals: validatedData.goals,
        comments: validatedData.comments,
      },
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

    return NextResponse.json(performanceReview, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating performance review:", error);
    return NextResponse.json(
      { error: "Failed to create performance review" },
      { status: 500 }
    );
  }
}
