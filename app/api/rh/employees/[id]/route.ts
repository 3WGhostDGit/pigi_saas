import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/employees/[id] - Get employee by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Properly access the id parameter
    const id = context.params.id

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Transform to expected employee format
    const nameParts = user.name?.split(' ') || ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Get position ID from job title if it's in the format "pos_*"
    let positionId = 'pos_default';
    if (user.jobTitle && user.jobTitle.startsWith('pos_')) {
      positionId = user.jobTitle;
    }

    const employee = {
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
      hireDate: user.entryDate?.toISOString() || new Date().toISOString(),
      phone: '',
      address: '',
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

// PUT /api/rh/employees/[id] - Update employee
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Properly access the id parameter
    const id = context.params.id
    const body = await req.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it's already in use
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: body.email,
          id: { not: id },
        },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use by another employee' },
          { status: 400 }
        )
      }
    }

    // Get the position title from the positions API
    let positionTitle = '';
    try {
      const baseUrl = req.nextUrl.origin;
      const positionsResponse = await fetch(`${baseUrl}/api/rh/positions`);
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

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        departmentId: body.departmentId,
        jobTitle: positionTitle, // Store the actual position title
        entryDate: body.hireDate ? new Date(body.hireDate) : undefined,
      },
      include: {
        department: true,
      },
    })

    // Transform to expected employee format
    const employee = {
      id: updatedUser.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: updatedUser.email || '',
      department: updatedUser.department || { id: '', name: 'Unassigned' },
      position: {
        id: body.positionId,
        title: positionTitle // Use the actual position title
      },
      status: body.status,
      hireDate: updatedUser.entryDate?.toISOString() || new Date().toISOString(),
      phone: body.phone || '',
      address: body.address || '',
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

// DELETE /api/rh/employees/[id] - Delete employee
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Properly access the id parameter
    const id = context.params.id

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Instead of deleting, we could mark the user as inactive
    // For now, we'll actually delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
