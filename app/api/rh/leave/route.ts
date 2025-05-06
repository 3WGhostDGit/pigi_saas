import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/leave - Get all leave requests
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (employeeId) {
      where.userId = employeeId // Changed from employeeId to userId to match schema
    }

    if (status) {
      where.status = status
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      }
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate),
      }
    }

    // Get leave requests with pagination
    const [leaveRequests, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: {
                select: {
                  id: true,
                  name: true
                }
              },
              jobTitle: true
            },
          },
          leaveType: true,
          approver: {
            select: {
              id: true,
              name: true,
              email: true
            },
          },
        },
      }),
      prisma.leaveRequest.count({ where }),
    ])

    return NextResponse.json({
      leaveRequests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching leave requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave requests' },
      { status: 500 }
    )
  }
}

// POST /api/rh/leave - Create a new leave request
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
    const requiredFields = ['userId', 'leaveTypeId', 'startDate', 'endDate', 'reason']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Parse dates
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    // Validate dates
    if (startDate > endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      )
    }

    // Calculate duration in days
    const durationMs = endDate.getTime() - startDate.getTime()
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1

    // Create new leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: body.userId,
        leaveTypeId: body.leaveTypeId,
        startDate,
        endDate,
        reason: body.reason,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
    })

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating leave request:', error)
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    )
  }
}
