import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating benefits
const benefitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  provider: z.string().optional(),
  costPerMonth: z.number().optional(),
  employeeContribution: z.number().optional(),
  companyContribution: z.number().optional(),
  isActive: z.boolean().default(true),
});

// Schema for creating/updating employee benefits
const employeeBenefitSchema = z.object({
  userId: z.string(),
  benefitId: z.string(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)).optional(),
  notes: z.string().optional(),
});

// GET /api/rh/benefits
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "benefits"; // Default to benefits
    const userId = url.searchParams.get("userId");
    const benefitId = url.searchParams.get("benefitId");
    const isActive = url.searchParams.get("isActive");

    if (type === "benefits") {
      // Build query filters for benefits
      const filters: any = {};
      
      if (isActive === "true") {
        filters.isActive = true;
      } else if (isActive === "false") {
        filters.isActive = false;
      }

      // Fetch benefits
      const benefits = await prisma.benefit.findMany({
        where: filters,
        include: {
          _count: {
            select: {
              employeeBenefits: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return NextResponse.json(benefits);
    } else if (type === "enrollments") {
      // Build query filters for employee benefits
      const filters: any = {};
      
      if (userId) {
        filters.userId = userId;
      }
      
      if (benefitId) {
        filters.benefitId = benefitId;
      }

      // Fetch employee benefits
      const employeeBenefits = await prisma.employeeBenefit.findMany({
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
          benefit: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      return NextResponse.json(employeeBenefits);
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'benefits' or 'enrollments'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching benefits data:", error);
    return NextResponse.json(
      { error: "Failed to fetch benefits data" },
      { status: 500 }
    );
  }
}

// POST /api/rh/benefits
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "benefits"; // Default to benefits

    const body = await request.json();

    if (type === "benefits") {
      const validatedData = benefitSchema.parse(body);

      // Create new benefit
      const benefit = await prisma.benefit.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          provider: validatedData.provider,
          costPerMonth: validatedData.costPerMonth,
          employeeContribution: validatedData.employeeContribution,
          companyContribution: validatedData.companyContribution,
          isActive: validatedData.isActive,
        },
      });

      return NextResponse.json(benefit, { status: 201 });
    } else if (type === "enrollments") {
      const validatedData = employeeBenefitSchema.parse(body);

      // Check if the user and benefit exist
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId },
      });

      const benefit = await prisma.benefit.findUnique({
        where: { id: validatedData.benefitId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      if (!benefit) {
        return NextResponse.json(
          { error: "Benefit not found" },
          { status: 404 }
        );
      }

      // Check if the user is already enrolled in this benefit
      const existingEnrollment = await prisma.employeeBenefit.findFirst({
        where: {
          userId: validatedData.userId,
          benefitId: validatedData.benefitId,
          endDate: null, // Only check active enrollments
        },
      });

      if (existingEnrollment) {
        return NextResponse.json(
          { error: "User is already enrolled in this benefit" },
          { status: 400 }
        );
      }

      // Create new employee benefit enrollment
      const enrollment = await prisma.employeeBenefit.create({
        data: {
          userId: validatedData.userId,
          benefitId: validatedData.benefitId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          notes: validatedData.notes,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          benefit: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json(enrollment, { status: 201 });
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'benefits' or 'enrollments'." },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating benefit data:", error);
    return NextResponse.json(
      { error: "Failed to create benefit data" },
      { status: 500 }
    );
  }
}
