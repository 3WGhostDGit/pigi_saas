import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/leave-types/[id] - Get leave type by ID
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

    const id = params.id

    // Get leave type
    const leaveType = await prisma.leaveType.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            leaveRequests: true,
          },
        },
      },
    })

    if (!leaveType) {
      return NextResponse.json(
        { error: 'Leave type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(leaveType)
  } catch (error) {
    console.error(`Error fetching leave type ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch leave type' },
      { status: 500 }
    )
  }
}

// PUT /api/rh/leave-types/[id] - Update leave type
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

    const id = params.id
    const body = await req.json()

    // Check if leave type exists
    const existingLeaveType = await prisma.leaveType.findUnique({
      where: { id },
    })

    if (!existingLeaveType) {
      return NextResponse.json(
        { error: 'Leave type not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and if it conflicts with an existing leave type
    if (body.name && body.name !== existingLeaveType.name) {
      const nameConflict = await prisma.leaveType.findUnique({
        where: { name: body.name },
      })

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Leave type with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Update leave type
    const updatedLeaveType = await prisma.leaveType.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json(updatedLeaveType)
  } catch (error) {
    console.error(`Error updating leave type ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to update leave type' },
      { status: 500 }
    )
  }
}

// DELETE /api/rh/leave-types/[id] - Delete leave type
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

    const id = params.id

    // Check if leave type exists
    const existingLeaveType = await prisma.leaveType.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            leaveRequests: true,
          },
        },
      },
    })

    if (!existingLeaveType) {
      return NextResponse.json(
        { error: 'Leave type not found' },
        { status: 404 }
      )
    }

    // Check if there are any leave requests using this leave type
    if (existingLeaveType._count.leaveRequests > 0) {
      return NextResponse.json(
        { error: 'Cannot delete leave type that is being used by leave requests' },
        { status: 400 }
      )
    }

    // Delete leave type
    await prisma.leaveType.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Leave type deleted successfully' })
  } catch (error) {
    console.error(`Error deleting leave type ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete leave type' },
      { status: 500 }
    )
  }
}
