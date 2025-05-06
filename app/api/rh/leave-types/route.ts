import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/rh/leave-types - Get all leave types
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    // Build filter conditions
    const where: any = {}
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    // Get leave types
    const leaveTypes = await prisma.leaveType.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(leaveTypes)
  } catch (error) {
    console.error('Error fetching leave types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave types' },
      { status: 500 }
    )
  }
}

// POST /api/rh/leave-types - Create a new leave type
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
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if leave type with the same name already exists
    const existingLeaveType = await prisma.leaveType.findUnique({
      where: { name: body.name },
    })

    if (existingLeaveType) {
      return NextResponse.json(
        { error: 'Leave type with this name already exists' },
        { status: 400 }
      )
    }

    // Create new leave type
    const leaveType = await prisma.leaveType.create({
      data: {
        name: body.name,
        description: body.description || null,
      },
    })

    return NextResponse.json(leaveType, { status: 201 })
  } catch (error) {
    console.error('Error creating leave type:', error)
    return NextResponse.json(
      { error: 'Failed to create leave type' },
      { status: 500 }
    )
  }
}
