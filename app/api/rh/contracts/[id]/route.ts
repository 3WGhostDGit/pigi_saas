import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating contracts
const updateContractSchema = z.object({
  contractType: z.enum([
    "PERMANENT",
    "FIXED_TERM",
    "INTERNSHIP",
    "APPRENTICESHIP",
    "FREELANCE"
  ]).optional(),
  status: z.enum([
    "ACTIVE",
    "ENDED",
    "PENDING",
    "TERMINATED"
  ]).optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional().nullable(),
  jobTitle: z.string().min(1).optional(),
  salary: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  workingHours: z.number().positive().optional().nullable(),
  trialPeriodEndDate: z.string().transform(str => new Date(str)).optional().nullable(),
  contractUrl: z.string().url().optional().nullable(),
});

// GET /api/rh/contracts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contract = await prisma.employeeContract.findUnique({
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

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/contracts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the contract exists
    const existingContract = await prisma.employeeContract.findUnique({
      where: { id: params.id },
    });

    if (!existingContract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateContractSchema.parse(body);

    // If changing to ACTIVE status, check if there's another active contract
    if (validatedData.status === "ACTIVE" && existingContract.status !== "ACTIVE") {
      const activeContract = await prisma.employeeContract.findFirst({
        where: {
          userId: existingContract.userId,
          status: "ACTIVE",
          id: { not: params.id },
        },
      });

      if (activeContract) {
        // End the current active contract
        await prisma.employeeContract.update({
          where: { id: activeContract.id },
          data: {
            status: "ENDED",
            endDate: validatedData.startDate || new Date(),
          },
        });
      }
    }

    // Update the contract
    const updatedContract = await prisma.employeeContract.update({
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

    // If salary changed, create a salary history record
    if (validatedData.salary && validatedData.salary !== existingContract.salary) {
      await prisma.salaryHistory.create({
        data: {
          userId: existingContract.userId,
          amount: validatedData.salary,
          currency: validatedData.currency || existingContract.currency,
          effectiveDate: new Date(),
          reason: "Contract update",
        },
      });
    }

    // Update user's job title if contract is active and job title changed
    if (
      (existingContract.status === "ACTIVE" || validatedData.status === "ACTIVE") &&
      validatedData.jobTitle &&
      validatedData.jobTitle !== existingContract.jobTitle
    ) {
      await prisma.user.update({
        where: { id: existingContract.userId },
        data: {
          jobTitle: validatedData.jobTitle,
        },
      });
    }

    return NextResponse.json(updatedContract);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/contracts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the contract exists
    const existingContract = await prisma.employeeContract.findUnique({
      where: { id: params.id },
    });

    if (!existingContract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Delete the contract
    await prisma.employeeContract.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Contract deleted successfully" });
  } catch (error) {
    console.error("Error deleting contract:", error);
    return NextResponse.json(
      { error: "Failed to delete contract" },
      { status: 500 }
    );
  }
}
