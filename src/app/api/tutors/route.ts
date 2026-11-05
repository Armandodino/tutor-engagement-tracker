import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      include: {
        user: true,
        sessions: {
          include: {
            attendance: true,
            sessionReport: true,
          },
        },
        engagementScores: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tutors)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, phone, matieres, centre } = body

    const user = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        role: 'TUTEUR',
        tutor: {
          create: {
            phone,
            matieres,
            centre,
          },
        },
      },
      include: {
        tutor: true,
      },
    })
    return NextResponse.json(user)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
