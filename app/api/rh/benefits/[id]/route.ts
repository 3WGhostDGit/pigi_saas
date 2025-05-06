import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for updating benefits
const updateBenefitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  provider: z.string().optional(),
  costPerMonth: z.number().optional(),
  employeeContribution: z.number().optional(),
  companyContribution: z.number().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/rh/benefits/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params before accessing properties
    const paramsObj = await params;
    const id = paramsObj.id;

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "benefits"; // Default to benefits

    if (type === "benefits") {
      const benefit = await prisma.benefit.findUnique({
        where: { id },
        include: {
          employeeBenefits: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  jobTitle: true,
                },
              },
            },
          },
          _count: {
            select: {
              employeeBenefits: true,
            },
          },
        },
      });

      if (!benefit) {
        return NextResponse.json(
          { error: "Benefit not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(benefit);
    } else if (type === "enrollments") {
      const enrollment = await prisma.employeeBenefit.findUnique({
        where: { id },
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
      });

      if (!enrollment) {
        return NextResponse.json(
          { error: "Benefit enrollment not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(enrollment);
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'benefits' or 'enrollments'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching benefit data:", error);
    return NextResponse.json(
      { error: "Failed to fetch benefit data" },
      { status: 500 }
    );
  }
}

// PUT /api/rh/benefits/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params before accessing properties
    const paramsObj = await params;
    const id = paramsObj.id;

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "benefits"; // Default to benefits

    if (type === "benefits") {
      // Check if the benefit exists
      const existingBenefit = await prisma.benefit.findUnique({
        where: { id },
      });

      if (!existingBenefit) {
        return NextResponse.json(
          { error: "Benefit not found" },
          { status: 404 }
        );
      }

      const body = await request.json();
      const validatedData = updateBenefitSchema.parse(body);

      // Update the benefit
      const updatedBenefit = await prisma.benefit.update({
        where: { id },
        data: validatedData,
      });

      return NextResponse.json(updatedBenefit);
    } else if (type === "enrollments") {
      // Check if the enrollment exists
      const existingEnrollment = await prisma.employeeBenefit.findUnique({
        where: { id },
      });

      if (!existingEnrollment) {
        return NextResponse.json(
          { error: "Benefit enrollment not found" },
          { status: 404 }
        );
      }

      const body = await request.json();
      const validatedData = z.object({
        startDate: z.string().transform(str => new Date(str)).optional(),
        endDate: z.string().transform(str => new Date(str)).optional().nullable(),
        notes: z.string().optional(),
      }).parse(body);

      // Update the enrollment
      const updatedEnrollment = await prisma.employeeBenefit.update({
        where: { id },
        data: validatedData,
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

      return NextResponse.json(updatedEnrollment);
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

    console.error("Error updating benefit data:", error);
    return NextResponse.json(
      { error: "Failed to update benefit data" },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/benefits/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params before accessing properties
    const paramsObj = await params;
    const id = paramsObj.id;

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "benefits"; // Default to benefits

    if (type === "benefits") {
      // Check if the benefit exists
      const existingBenefit = await prisma.benefit.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              employeeBenefits: true,
            },
          },
        },
      });

      if (!existingBenefit) {
        return NextResponse.json(
          { error: "Benefit not found" },
          { status: 404 }
        );
      }

      // Check if there are any enrollments for this benefit
      if (existingBenefit._count.employeeBenefits > 0) {
        return NextResponse.json(
          { error: "Cannot delete benefit with active enrollments" },
          { status: 400 }
        );
      }

      // Delete the benefit
      await prisma.benefit.delete({
        where: { id },
      });

      return NextResponse.json({ message: "Benefit deleted successfully" });
    } else if (type === "enrollments") {
      // Check if the enrollment exists
      const existingEnrollment = await prisma.employeeBenefit.findUnique({
        where: { id },
      });

      if (!existingEnrollment) {
        return NextResponse.json(
          { error: "Benefit enrollment not found" },
          { status: 404 }
        );
      }

      // Delete the enrollment
      await prisma.employeeBenefit.delete({
        where: { id },
      });

      return NextResponse.json({ message: "Benefit enrollment deleted successfully" });
    }

    return NextResponse.json(
      { error: "Invalid type parameter. Use 'benefits' or 'enrollments'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting benefit data:", error);
    return NextResponse.json(
      { error: "Failed to delete benefit data" },
      { status: 500 }
    );
  }
}
