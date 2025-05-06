import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { debugLog } from '@/lib/debug'
import { createDebugPrismaClient, debugPrismaQuery } from '@/lib/prisma-debug'

// Use debug Prisma client in development, regular in production
const prisma = process.env.NODE_ENV === 'development'
  ? createDebugPrismaClient()
  : new PrismaClient()

// GET /api/rh/employees - Get all employees
export async function GET(req: NextRequest) {
  try {
    // Start debugging
    debugLog('GET /api/rh/employees', { url: req.url });

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      debugLog('Authentication failed', { session });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const departmentId = searchParams.get('departmentId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    debugLog('Query parameters', {
      search, departmentId, status, page, limit, skip,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Build filter conditions
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    if (status) {
      where.status = status
    }

    debugLog('Query filter conditions', { where });

    // Get users with pagination using our debug wrapper
    const [users, total] = await Promise.all([
      debugPrismaQuery('Find employees', () =>
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
          include: {
            department: true,
            roles: {
              include: {
                role: true
              }
            },
          },
        })
      ),
      debugPrismaQuery('Count employees', () =>
        prisma.user.count({ where })
      ),
    ])

    // Transform users to match the expected employee structure
    const employees = users.map(user => {
      // Split name into firstName and lastName
      const nameParts = user.name?.split(' ') || ['', '']
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Get position ID from job title if it's in the format "pos_*"
      let positionId = 'pos_default';
      if (user.jobTitle && user.jobTitle.startsWith('pos_')) {
        positionId = user.jobTitle;
      }

      // Extract role names from the user roles
      let roles = user.roles ? user.roles.map((userRole: any) => userRole.role.name) : [];

      // If no roles are found, add a default role based on the user's position
      if (roles.length === 0) {
        // Add mock roles for testing based on user properties
        if (user.managerId === null) {
          roles = ['MANAGER', 'DEPT_MANAGER'];
        } else if (user.jobTitle && user.jobTitle.toLowerCase().includes('manager')) {
          roles = ['MANAGER'];
        } else if (user.email && user.email.includes('admin')) {
          roles = ['ADMIN'];
        } else {
          roles = ['EMPLOYEE'];
        }
      }

      return {
        id: user.id,
        firstName,
        lastName,
        email: user.email || '',
        department: user.department || { id: '', name: 'Unassigned' },
        position: {
          id: positionId,
          title: user.jobTitle || 'Unassigned'
        },
        status: 'ACTIVE',
        hireDate: user.entryDate || new Date().toISOString(),
        phone: '',
        address: '',
        roles: roles, // Add roles to the employee object
      }
    })

    // Prepare response
    const response = {
      employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    debugLog('Employees response', {
      employeeCount: employees.length,
      pagination: response.pagination,
      firstEmployee: employees[0] || null
    });

    // Add a breakpoint here when debugging
    // debugger;

    return NextResponse.json(response);
  } catch (error) {
    debugLog('Error fetching employees', { error });
    console.error('Error fetching employees:', error);

    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/rh/employees - Create a new employee
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await req.json()

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'departmentId', 'positionId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Get the position title from the positions API
    let positionTitle = '';
    try {
      const positionsResponse = await fetch(`${req.nextUrl.origin}/api/rh/positions`);
      if (positionsResponse.ok) {
        const positions = await positionsResponse.json();
        const position = positions.find((p: any) => p.id === body.positionId);
        if (position) {
          positionTitle = position.title;
        }
      }
    } catch (err) {
      console.error('Error fetching position title:', err);
    }

    // If position title is not found, use a default format
    if (!positionTitle) {
      positionTitle = body.positionTitle || 'Position ' + body.positionId;
    }

    // Create new user instead of employee
    const user = await prisma.user.create({
      data: {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        departmentId: body.departmentId,
        jobTitle: positionTitle, // Store the actual position title
        entryDate: body.hireDate ? new Date(body.hireDate) : new Date(),
      },
      include: {
        department: true,
      },
    })

    // Transform to expected employee format
    const employee = {
      id: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: user.email || '',
      department: user.department || { id: '', name: 'Unassigned' },
      position: {
        id: body.positionId,
        title: positionTitle // Use the actual position title
      },
      status: body.status || 'ACTIVE',
      hireDate: user.entryDate?.toISOString() || new Date().toISOString(),
      phone: body.phone || '',
      address: body.address || '',
    }

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
