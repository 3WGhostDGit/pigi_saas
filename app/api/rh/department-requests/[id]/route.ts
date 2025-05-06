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

// GET /api/rh/department-requests/[id] - Get a specific department request
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Properly access the id parameter from context - await it first
    const params = await context.params;
    const id = params.id;

    // Get the request with more details
    const request = await prisma.departmentUpdateRequest.findUnique({
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
            // Removed position field as it doesn't exist in the User model
          },
        },
        requestedDepartment: true,
        processedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    // Include all roles that can view department requests
    const isAuthorized = userRoles.includes('ADMIN') ||
                         userRoles.includes('HR_ADMIN') ||
                         userRoles.includes('HR') ||
                         userRoles.includes('MANAGER') ||
                         userRoles.includes('DEPT_MANAGER');
    const isOwner = request.userId === session.user.id;

    // Log for debugging
    console.log('User roles:', userRoles);
    console.log('Is authorized:', isAuthorized);
    console.log('Is owner:', isOwner);
    console.log('Request user ID:', request.userId);
    console.log('Session user ID:', session.user.id);

    if (!isAuthorized && !isOwner) {
      return NextResponse.json({ error: 'Forbidden - You do not have permission to view this request' }, { status: 403 });
    }

    // Format the response
    const formattedRequest = {
      id: request.id,
      userId: request.userId,
      userName: request.user.name,
      userEmail: request.user.email,
      currentDepartmentName: request.user.department?.name,
      requestedDepartmentId: request.requestedDepartmentId,
      requestedDepartmentName: request.requestedDepartment.name,
      reason: request.reason,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      processedAt: request.processedAt?.toISOString() || null,
      processedById: request.processedById,
      processedByName: request.processedBy?.name || null,
      adminNotes: request.adminNotes || null,
      currentJobTitle: request.user.jobTitle || null,
      requestedJobTitle: request.requestedJobTitle || null,
    };

    return NextResponse.json({ request: formattedRequest });
  } catch (error) {
    console.error(`Error fetching department request:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch department request' },
      { status: 500 }
    );
  }
}

// PUT /api/rh/department-requests/[id] - Update a department request (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has appropriate role
    const userRoles = session.user.roles || [];
    const isAuthorized = userRoles.includes('ADMIN') ||
                         userRoles.includes('HR_ADMIN') ||
                         userRoles.includes('HR');

    if (!isAuthorized) {
      console.log('UPDATE - User roles:', userRoles);
      return NextResponse.json({ error: 'Forbidden - You do not have permission to update department requests' }, { status: 403 });
    }

    // Properly access the id parameter from context - await it first
    const params = await context.params;
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

    // If approved, update the user's department and job title
    if (validatedData.status === 'APPROVED') {
      // Get the user's current data
      const user = await prisma.user.findUnique({
        where: { id: existingRequest.userId },
        select: {
          id: true,
          name: true,
          email: true,
          departmentId: true,
          jobTitle: true,
        },
      });

      if (user) {
        // Update the user's department and job title if requested
        await prisma.user.update({
          where: { id: existingRequest.userId },
          data: {
            departmentId: existingRequest.requestedDepartmentId,
            // Only update job title if it was requested
            ...(existingRequest.requestedJobTitle && {
              jobTitle: existingRequest.requestedJobTitle,
            }),
          },
        });

        // Log the department change
        await prisma.activityLog.create({
          data: {
            userId: existingRequest.userId,
            action: 'DEPARTMENT_CHANGED',
            description: `Department changed from ${existingRequest.user?.department?.name || 'None'} to ${existingRequest.requestedDepartment.name}`,
            performedById: session.user.id,
          },
        }).catch(err => console.error('Failed to log department change:', err));
      }
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error(`Error updating department request:`, error);
    return NextResponse.json(
      { error: 'Failed to update department request' },
      { status: 500 }
    );
  }
}

// DELETE /api/rh/department-requests/[id] - Delete a department request
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Properly access the id parameter from context - await it first
    const params = await context.params;
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
    // Include all roles that can delete department requests
    const isAuthorized = userRoles.includes('ADMIN') ||
                         userRoles.includes('HR_ADMIN') ||
                         userRoles.includes('HR');
    const isOwner = request.userId === session.user.id;

    // Log for debugging
    console.log('DELETE - User roles:', userRoles);
    console.log('DELETE - Is authorized:', isAuthorized);
    console.log('DELETE - Is owner:', isOwner);

    if (!isAuthorized && !isOwner) {
      return NextResponse.json({ error: 'Forbidden - You do not have permission to delete this request' }, { status: 403 });
    }

    // Delete the request
    await prisma.departmentUpdateRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting department request:`, error);
    return NextResponse.json(
      { error: 'Failed to delete department request' },
      { status: 500 }
    );
  }
}
