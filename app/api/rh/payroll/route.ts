import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating salary records
const salarySchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("EUR"),
  effectiveDate: z.string().transform(str => new Date(str)),
  reason: z.string().optional(),
});

// GET /api/rh/payroll
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Build query filters
    const filters: any = {};
    
    if (userId) {
      filters.userId = userId;
    }
    
    if (startDate || endDate) {
      filters.effectiveDate = {};
      
      if (startDate) {
        filters.effectiveDate.gte = new Date(startDate);
      }
      
      if (endDate) {
        filters.effectiveDate.lte = new Date(endDate);
      }
    }

    // Fetch salary history records
    const salaryHistory = await prisma.salaryHistory.findMany({
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
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    return NextResponse.json(salaryHistory);
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    return NextResponse.json(
      { error: "Failed to fetch payroll data" },
      { status: 500 }
    );
  }
}

// POST /api/rh/payroll
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = salarySchema.parse(body);

    // Create new salary history record
    const salaryRecord = await prisma.salaryHistory.create({
      data: {
        userId: validatedData.userId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        effectiveDate: validatedData.effectiveDate,
        reason: validatedData.reason,
      },
    });

    // Update the employee's contract with the new salary if it's the most recent
    const latestSalary = await prisma.salaryHistory.findFirst({
      where: { userId: validatedData.userId },
      orderBy: { effectiveDate: 'desc' },
    });

    if (latestSalary?.id === salaryRecord.id) {
      await prisma.employeeContract.updateMany({
        where: { 
          userId: validatedData.userId,
          status: 'ACTIVE'
        },
        data: { 
          salary: validatedData.amount,
          currency: validatedData.currency
        }
      });
    }

    return NextResponse.json(salaryRecord, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating salary record:", error);
    return NextResponse.json(
      { error: "Failed to create salary record" },
      { status: 500 }
    );
  }
}
