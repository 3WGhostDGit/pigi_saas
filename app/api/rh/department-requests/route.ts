import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/rh/department-requests - Get all department requests
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has appropriate role to view department requests
    const userRoles = session.user.roles || [];
    const isAuthorized = userRoles.includes('ADMIN') ||
                         userRoles.includes('HR_ADMIN') ||
                         userRoles.includes('HR') ||
                         userRoles.includes('MANAGER') ||
                         userRoles.includes('DEPT_MANAGER');

    if (!isAuthorized) {
      console.log('User roles:', userRoles);
      return NextResponse.json({ error: 'Forbidden - You do not have permission to view department requests' }, { status: 403 });
    }

    // Get all department requests with related data
    const departmentRequests = await prisma.departmentUpdateRequest.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match the expected format in the frontend
    const formattedRequests = departmentRequests.map(request => {
      return {
        id: request.id,
        userId: request.userId,
        userName: request.user.name || 'Unknown',
        userEmail: request.user.email || '',
        currentDepartmentName: request.user.department?.name || null,
        requestedDepartmentId: request.requestedDepartmentId,
        requestedDepartmentName: request.requestedDepartment.name,
        reason: request.additionalInfo || '',
        status: request.status,
        createdAt: request.createdAt.toISOString(),
        adminNotes: request.adminNotes || null,
      };
    });

    return NextResponse.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Error fetching department requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department requests' },
      { status: 500 }
    );
  }
}

// POST /api/rh/department-requests - Create a new department request
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.requestedDepartmentId) {
      return NextResponse.json(
        { error: 'Requested department is required' },
        { status: 400 }
      );
    }

    // Create new department request
    const newRequest = await prisma.departmentUpdateRequest.create({
      data: {
        userId: session.user.id,
        requestedDepartmentId: body.requestedDepartmentId,
        currentJobTitle: body.currentJobTitle || null,
        requestedJobTitle: body.requestedJobTitle || null,
        additionalInfo: body.reason || null,
        status: 'PENDING',
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
      },
    });

    // Format response to match frontend expectations
    const formattedRequest = {
      id: newRequest.id,
      userId: newRequest.userId,
      userName: newRequest.user.name || 'Unknown',
      userEmail: newRequest.user.email || '',
      currentDepartmentName: newRequest.user.department?.name || null,
      requestedDepartmentId: newRequest.requestedDepartmentId,
      requestedDepartmentName: newRequest.requestedDepartment.name,
      reason: newRequest.additionalInfo || '',
      status: newRequest.status,
      createdAt: newRequest.createdAt.toISOString(),
      adminNotes: newRequest.adminNotes || null,
    };

    return NextResponse.json(formattedRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating department request:', error);
    return NextResponse.json(
      { error: 'Failed to create department request' },
      { status: 500 }
    );
  }
}
