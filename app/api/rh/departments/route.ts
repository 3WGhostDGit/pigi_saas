import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/departments - Get all departments
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const includeEmployees = searchParams.get('includeEmployees') === 'true'

    // Get departments
    let departments = await prisma.department.findMany({
      include: {
        users: includeEmployees ? {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
          },
        } : false,
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    // If no departments found, create mock departments
    if (departments.length === 0) {
      try {
        // Create some default departments
        const defaultDepartments = [
          { name: "Human Resources", description: "HR department" },
          { name: "Engineering", description: "Engineering department" },
          { name: "Finance", description: "Finance department" },
          { name: "Marketing", description: "Marketing department" },
          { name: "Operations", description: "Operations department" }
        ]

        // Create departments in the database
        for (const dept of defaultDepartments) {
          try {
            const createdDept = await prisma.department.create({
              data: dept
            })
            departments.push(createdDept)
          } catch (err) {
            console.error(`Error creating department ${dept.name}:`, err)
          }
        }
      } catch (err) {
        console.error("Error creating default departments:", err)
      }
    }

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

// POST /api/rh/departments - Create a new department
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
    if (!body.name) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      )
    }

    // Check if department with same name already exists
    const existingDepartment = await prisma.department.findFirst({
      where: { name: body.name },
    })

    if (existingDepartment) {
      return NextResponse.json(
        { error: 'Department with this name already exists' },
        { status: 400 }
      )
    }

    // Create new department
    const department = await prisma.department.create({
      data: {
        name: body.name,
        description: body.description || null,
        managerId: body.managerId || null,
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}
