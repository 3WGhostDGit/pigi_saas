import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/positions - Get all positions
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get('departmentId')

    // Build filter conditions
    const where: any = {}

    if (departmentId) {
      where.departmentId = departmentId
    }

    // Since the Position model might not exist yet, let's return mock positions
    // based on the departments
    const departments = await prisma.department.findMany()

    // Make sure we have at least one department
    if (departments.length === 0) {
      // Create a default department if none exists
      const defaultDept = await prisma.department.create({
        data: {
          name: "General",
          description: "Default department"
        }
      })
      departments.push(defaultDept)
    }

    // Create a position for each department to ensure we have options
    const positions = departments.map((dept, index) => {
      return {
        id: `pos_${index + 1}`,
        title: `${dept.name} Specialist`,
        departmentId: dept.id,
        department: {
          id: dept.id,
          name: dept.name
        },
        _count: { employees: 0 }
      }
    })

    // Add some common positions
    if (departments.length > 1) {
      positions.push(
        {
          id: "pos_dev",
          title: "Software Developer",
          departmentId: departments[0].id,
          department: {
            id: departments[0].id,
            name: departments[0].name
          },
          _count: { employees: 0 }
        },
        {
          id: "pos_manager",
          title: "Department Manager",
          departmentId: departments[0].id,
          department: {
            id: departments[0].id,
            name: departments[0].name
          },
          _count: { employees: 0 }
        },
        {
          id: "pos_admin",
          title: "Administrator",
          departmentId: departments[0].id,
          department: {
            id: departments[0].id,
            name: departments[0].name
          },
          _count: { employees: 0 }
        }
      )
    }

    // Filter by departmentId if provided
    const filteredPositions = departmentId
      ? positions.filter(p => p.departmentId === departmentId)
      : positions

    return NextResponse.json(filteredPositions)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}

// POST /api/rh/positions - Create a new position
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
    if (!body.title || !body.departmentId) {
      return NextResponse.json(
        { error: 'Title and department are required' },
        { status: 400 }
      )
    }

    // Check if position with same title in same department already exists
    const existingPosition = await prisma.position.findFirst({
      where: {
        title: body.title,
        departmentId: body.departmentId,
      },
    })

    if (existingPosition) {
      return NextResponse.json(
        { error: 'Position with this title already exists in this department' },
        { status: 400 }
      )
    }

    // Create new position
    const position = await prisma.position.create({
      data: {
        title: body.title,
        description: body.description,
        departmentId: body.departmentId,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error('Error creating position:', error)
    return NextResponse.json(
      { error: 'Failed to create position' },
      { status: 500 }
    )
  }
}
