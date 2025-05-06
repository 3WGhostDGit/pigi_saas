import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for department update requests
const departmentRequestSchema = z.object({
  userId: z.string(),
  requestedDepartmentId: z.string(),
  currentJobTitle: z.string().optional(),
  requestedJobTitle: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// GET /api/profile/department-request - Get all department requests (for admins)
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const userRoles = session.user.roles || [];
    const isAdmin = userRoles.includes('ADMIN');
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all department requests
    const requests = await prisma.departmentUpdateRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        requestedDepartment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching department requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department requests' },
      { status: 500 }
    );
  }
}

// POST /api/profile/department-request - Create a new department request
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    
    // Validate request data
    const validatedData = departmentRequestSchema.parse({
      ...body,
      userId: session.user.id, // Always use the authenticated user's ID
    });

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: validatedData.requestedDepartmentId },
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    // Create department update request
    const request = await prisma.departmentUpdateRequest.create({
      data: {
        userId: validatedData.userId,
        requestedDepartmentId: validatedData.requestedDepartmentId,
        currentJobTitle: validatedData.currentJobTitle || null,
        requestedJobTitle: validatedData.requestedJobTitle || null,
        additionalInfo: validatedData.additionalInfo || null,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        requestedDepartment: true,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating department request:', error);
    return NextResponse.json(
      { error: 'Failed to create department request' },
      { status: 500 }
    );
  }
}
