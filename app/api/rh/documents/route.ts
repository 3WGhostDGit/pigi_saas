import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for creating/updating documents
const documentSchema = z.object({
  userId: z.string(),
  documentType: z.enum([
    "ID_CARD",
    "PASSPORT",
    "RESIDENCE_PERMIT",
    "CONTRACT",
    "CERTIFICATE",
    "PAYSLIP",
    "OTHER"
  ]),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  description: z.string().optional(),
  issueDate: z.string().transform(str => new Date(str)).optional(),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
});

// GET /api/rh/documents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const documentType = url.searchParams.get("documentType");
    const expiringOnly = url.searchParams.get("expiringOnly") === "true";

    // Build query filters
    const filters: any = {};
    
    if (userId) {
      filters.userId = userId;
    }
    
    if (documentType) {
      filters.documentType = documentType;
    }
    
    if (expiringOnly) {
      const today = new Date();
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      
      filters.expiryDate = {
        not: null,
        gte: today,
        lte: ninetyDaysFromNow,
      };
    }

    // Fetch documents
    const documents = await prisma.employeeDocument.findMany({
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
      orderBy: [
        {
          uploadedAt: 'desc',
        },
      ],
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/rh/documents
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = documentSchema.parse(body);

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

    // Create new document
    const document = await prisma.employeeDocument.create({
      data: {
        userId: validatedData.userId,
        documentType: validatedData.documentType,
        fileName: validatedData.fileName,
        fileUrl: validatedData.fileUrl,
        description: validatedData.description,
        issueDate: validatedData.issueDate,
        expiryDate: validatedData.expiryDate,
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

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
