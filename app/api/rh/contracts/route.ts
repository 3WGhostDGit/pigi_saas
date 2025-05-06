import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating contracts
const contractSchema = z.object({
  userId: z.string(),
  contractType: z.enum([
    "PERMANENT",
    "FIXED_TERM",
    "INTERNSHIP",
    "APPRENTICESHIP",
    "FREELANCE"
  ]),
  status: z.enum([
    "ACTIVE",
    "ENDED",
    "PENDING",
    "TERMINATED"
  ]).default("ACTIVE"),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)).optional(),
  jobTitle: z.string().min(1),
  salary: z.number().positive(),
  currency: z.string().length(3).default("EUR"),
  workingHours: z.number().positive().optional(),
  trialPeriodEndDate: z.string().transform(str => new Date(str)).optional(),
  contractUrl: z.string().url().optional(),
});

// GET /api/rh/contracts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const status = url.searchParams.get("status");
    const contractType = url.searchParams.get("contractType");

    // Build query filters
    const filters: any = {};
    
    if (userId) {
      filters.userId = userId;
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (contractType) {
      filters.contractType = contractType;
    }

    // Fetch contracts
    const contracts = await prisma.employeeContract.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
          startDate: 'desc',
        },
      ],
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

// POST /api/rh/contracts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contractSchema.parse(body);

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

    // Check if there's an active contract for this user
    if (validatedData.status === "ACTIVE") {
      const activeContract = await prisma.employeeContract.findFirst({
        where: {
          userId: validatedData.userId,
          status: "ACTIVE",
        },
      });

      if (activeContract) {
        // End the current active contract
        await prisma.employeeContract.update({
          where: { id: activeContract.id },
          data: {
            status: "ENDED",
            endDate: validatedData.startDate,
          },
        });
      }
    }

    // Create new contract
    const contract = await prisma.employeeContract.create({
      data: {
        userId: validatedData.userId,
        contractType: validatedData.contractType,
        status: validatedData.status,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        jobTitle: validatedData.jobTitle,
        salary: validatedData.salary,
        currency: validatedData.currency,
        workingHours: validatedData.workingHours,
        trialPeriodEndDate: validatedData.trialPeriodEndDate,
        contractUrl: validatedData.contractUrl,
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

    // Update user's job title if contract is active
    if (validatedData.status === "ACTIVE") {
      await prisma.user.update({
        where: { id: validatedData.userId },
        data: {
          jobTitle: validatedData.jobTitle,
        },
      });

      // Create salary history record
      await prisma.salaryHistory.create({
        data: {
          userId: validatedData.userId,
          amount: validatedData.salary,
          currency: validatedData.currency,
          effectiveDate: validatedData.startDate,
          reason: `New ${validatedData.contractType.toLowerCase()} contract`,
        },
      });
    }

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}
