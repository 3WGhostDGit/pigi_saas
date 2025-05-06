import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for updating department requests
const updateRequestSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  adminNotes: z.string().optional(),
});

// GET /api/profile/department-request/[id] - Get a specific department request
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Get the request
    const request = await prisma.departmentUpdateRequest.findUnique({
      where: { id },
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
    });

    if (!request) {
      return NextResponse.json(
        { error: 'Department request not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this request
    const userRoles = session.user.roles || [];
    const isAdmin = userRoles.includes('ADMIN');
    const isOwner = request.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error(`Error fetching department request ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch department request' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/department-request/[id] - Update a department request (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = params.id;
    const body = await req.json();

    // Validate request data
    const validatedData = updateRequestSchema.parse(body);

    // Check if request exists
    const existingRequest = await prisma.departmentUpdateRequest.findUnique({
      where: { id },
      include: {
        user: true,
        requestedDepartment: true,
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Department request not found' },
        { status: 404 }
      );
    }

    // Update the request
    const updatedRequest = await prisma.departmentUpdateRequest.update({
      where: { id },
      data: {
        status: validatedData.status,
        adminNotes: validatedData.adminNotes,
        processedAt: validatedData.status !== 'PENDING' ? new Date() : null,
        processedById: validatedData.status !== 'PENDING' ? session.user.id : null,
      },
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
    });

    // If approved, update the user's department
    if (validatedData.status === 'APPROVED') {
      await prisma.user.update({
        where: { id: existingRequest.userId },
        data: {
          departmentId: existingRequest.requestedDepartmentId,
          jobTitle: existingRequest.requestedJobTitle,
        },
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error(`Error updating department request ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update department request' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile/department-request/[id] - Delete a department request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Get the request
    const request = await prisma.departmentUpdateRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json(
        { error: 'Department request not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete this request
    const userRoles = session.user.roles || [];
    const isAdmin = userRoles.includes('ADMIN');
    const isOwner = request.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the request
    await prisma.departmentUpdateRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting department request ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete department request' },
      { status: 500 }
    );
  }
}
