import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/leave/[id] - Get leave request by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Make sure to await params if needed
    const id = params.id

    // Get leave request with related data
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
            department: true,
          },
        },
        leaveType: true,
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(leaveRequest)
  } catch (error) {
    console.error(`Error fetching leave request ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch leave request' },
      { status: 500 }
    )
  }
}

// PUT /api/rh/leave/[id] - Update leave request
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Debug log
    console.log('PUT /api/rh/leave/[id] - Request body:', body)

    // Validate status value
    if (body.status && !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be one of: PENDING, APPROVED, REJECTED, CANCELLED' },
        { status: 400 }
      )
    }

    // Check if leave request exists
    const existingLeaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
    })

    if (!existingLeaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    // If updating dates, recalculate duration
    let durationDays = existingLeaveRequest.duration
    if (body.startDate && body.endDate) {
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
      durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1
    }

    // Update leave request
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        leaveTypeId: body.leaveTypeId,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        reason: body.reason,
        status: body.status,
        approverId: body.status === 'APPROVED' || body.status === 'REJECTED'
          ? session.user.id
          : null,
        approvedAt: body.status === 'APPROVED' || body.status === 'REJECTED'
          ? new Date()
          : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
            department: true,
          },
        },
        leaveType: true,
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedLeaveRequest)
  } catch (error) {
    console.error(`Error updating leave request ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    )
  }
}

// DELETE /api/rh/leave/[id] - Delete leave request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if leave request exists
    const existingLeaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
    })

    if (!existingLeaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of pending requests
    if (existingLeaveRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending leave requests can be deleted' },
        { status: 400 }
      )
    }

    // Delete leave request
    await prisma.leaveRequest.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Leave request deleted successfully' })
  } catch (error) {
    console.error(`Error deleting leave request ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete leave request' },
      { status: 500 }
    )
  }
}
