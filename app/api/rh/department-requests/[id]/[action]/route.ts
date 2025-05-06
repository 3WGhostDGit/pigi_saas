import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for admin notes
const adminNotesSchema = z.object({
  adminNotes: z.string().optional(),
});

// PUT /api/rh/department-requests/[id]/[action] - Process a department request (approve/reject)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string; action: string } }
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
                         userRoles.includes('HR') ||
                         userRoles.includes('DEPT_MANAGER');

    if (!isAuthorized) {
      console.log('ACTION - User roles:', userRoles);
      return NextResponse.json({ error: 'Forbidden - You do not have permission to process department requests' }, { status: 403 });
    }

    // Properly access the parameters from context - await them first
    const params = await context.params;
    const id = params.id;
    const action = params.action;

    // Validate action
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Parse request body for admin notes
    const body = await req.json().catch(() => ({}));
    const { adminNotes } = adminNotesSchema.parse(body);

    // Check if request exists
    const existingRequest = await prisma.departmentUpdateRequest.findUnique({
      where: { id },
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
            jobTitle: true,
            // Removed position field as it doesn't exist in the User model
          },
        },
        requestedDepartment: true,
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Department request not found' },
        { status: 404 }
      );
    }

    // Check if request is already processed
    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 400 }
      );
    }

    // Process the request
    const status = action === 'approve' ? 'APPROVED' : 'REJECTED';

    const updatedRequest = await prisma.departmentUpdateRequest.update({
      where: { id },
      data: {
        status,
        adminNotes,
        processedAt: new Date(),
        processedById: session.user.id,
      },
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
        requestedDepartment: true,
        processedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // If approved, update the user's department and job title
    if (status === 'APPROVED') {
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

    // Format the response
    const formattedRequest = {
      id: updatedRequest.id,
      userId: updatedRequest.userId,
      userName: updatedRequest.user.name,
      userEmail: updatedRequest.user.email,
      currentDepartmentName: updatedRequest.user.department?.name,
      requestedDepartmentId: updatedRequest.requestedDepartmentId,
      requestedDepartmentName: updatedRequest.requestedDepartment.name,
      reason: updatedRequest.reason,
      status: updatedRequest.status,
      createdAt: updatedRequest.createdAt.toISOString(),
      updatedAt: updatedRequest.updatedAt.toISOString(),
      processedAt: updatedRequest.processedAt?.toISOString() || null,
      processedById: updatedRequest.processedById,
      processedByName: updatedRequest.processedBy?.name || null,
      adminNotes: updatedRequest.adminNotes || null,
    };

    return NextResponse.json({ request: formattedRequest });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error(`Error processing department request (${action}):`, error);
    return NextResponse.json(
      { error: 'Failed to process department request' },
      { status: 500 }
    );
  }
}
