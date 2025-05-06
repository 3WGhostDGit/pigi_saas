import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// PUT /api/rh/department-requests/[id]/approve - Approve a department request
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
                         userRoles.includes('HR') ||
                         userRoles.includes('DEPT_MANAGER');

    if (!isAuthorized) {
      console.log('APPROVE - User roles:', userRoles);
      return NextResponse.json({ error: 'Forbidden - You do not have permission to approve department requests' }, { status: 403 });
    }

    // Properly access the id parameter from context
    const id = context.params.id;
    const body = await req.json();

    // Check if request exists
    const existingRequest = await prisma.departmentUpdateRequest.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Department request not found' },
        { status: 404 }
      );
    }

    // Only allow processing of pending requests
    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending requests can be approved' },
        { status: 400 }
      );
    }

    // Update request status to APPROVED
    const updatedRequest = await prisma.departmentUpdateRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        adminNotes: body.adminNotes,
        processedById: session.user.id,
        processedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
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

    // Update user's department
    await prisma.user.update({
      where: { id: existingRequest.userId },
      data: {
        departmentId: existingRequest.requestedDepartmentId,
        jobTitle: existingRequest.requestedJobTitle || existingRequest.user.jobTitle,
      },
    });

    // Format response to match frontend expectations
    const formattedRequest = {
      id: updatedRequest.id,
      userId: updatedRequest.userId,
      userName: updatedRequest.user.name || 'Unknown',
      userEmail: updatedRequest.user.email || '',
      currentDepartmentName: updatedRequest.user.department?.name || null,
      requestedDepartmentId: updatedRequest.requestedDepartmentId,
      requestedDepartmentName: updatedRequest.requestedDepartment.name,
      reason: updatedRequest.additionalInfo || '',
      status: updatedRequest.status,
      createdAt: updatedRequest.createdAt.toISOString(),
      adminNotes: updatedRequest.adminNotes || null,
    };

    return NextResponse.json(formattedRequest);
  } catch (error) {
    console.error(`Error approving department request:`, error);
    return NextResponse.json(
      { error: 'Failed to approve department request' },
      { status: 500 }
    );
  }
}
