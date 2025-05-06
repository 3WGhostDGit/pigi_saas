import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating salary records
const updateSalarySchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  effectiveDate: z.string().transform(str => new Date(str)).optional(),
  reason: z.string().optional(),
});

// GET /api/rh/payroll/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const salaryRecord = await prisma.salaryHistory.findUnique({
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

    if (!salaryRecord) {
      return NextResponse.json(
        { error: "Salary record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(salaryRecord);
  } catch (error) {
    console.error("Error fetching salary record:", error);
    return NextResponse.json(
      { error: "Failed to fetch salary record" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/payroll/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the salary record exists
    const existingRecord = await prisma.salaryHistory.findUnique({
      where: { id: params.id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Salary record not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateSalarySchema.parse(body);

    // Update the salary record
    const updatedRecord = await prisma.salaryHistory.update({
      where: { id: params.id },
      data: validatedData,
    });

    // Check if this is the latest salary record for the employee
    const latestSalary = await prisma.salaryHistory.findFirst({
      where: { userId: existingRecord.userId },
      orderBy: { effectiveDate: 'desc' },
    });

    // If this is the latest record, update the employee's contract
    if (latestSalary?.id === params.id && (validatedData.amount || validatedData.currency)) {
      await prisma.employeeContract.updateMany({
        where: { 
          userId: existingRecord.userId,
          status: 'ACTIVE'
        },
        data: { 
          salary: validatedData.amount ?? existingRecord.amount,
          currency: validatedData.currency ?? existingRecord.currency
        }
      });
    }

    return NextResponse.json(updatedRecord);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating salary record:", error);
    return NextResponse.json(
      { error: "Failed to update salary record" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/payroll/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the salary record exists
    const existingRecord = await prisma.salaryHistory.findUnique({
      where: { id: params.id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Salary record not found" },
        { status: 404 }
      );
    }

    // Delete the salary record
    await prisma.salaryHistory.delete({
      where: { id: params.id },
    });

    // If this was the latest salary record, update the contract with the previous salary
    const latestSalary = await prisma.salaryHistory.findFirst({
      where: { userId: existingRecord.userId },
      orderBy: { effectiveDate: 'desc' },
    });

    if (latestSalary) {
      await prisma.employeeContract.updateMany({
        where: { 
          userId: existingRecord.userId,
          status: 'ACTIVE'
        },
        data: { 
          salary: latestSalary.amount,
          currency: latestSalary.currency
        }
      });
    }

    return NextResponse.json({ message: "Salary record deleted successfully" });
  } catch (error) {
    console.error("Error deleting salary record:", error);
    return NextResponse.json(
      { error: "Failed to delete salary record" },
      { status: 500 }
    );
  }
}
