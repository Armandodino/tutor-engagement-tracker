import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        tutor: {
          include: { user: true },
        },
        attendance: true,
        sessionReport: true,
      },
      orderBy: { dateDebut: 'desc' },
    })
    return NextResponse.json(sessions)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tutorId, titre, matiere, classe, salle, enLigne, lieu, dateDebut, dateFin, notes } = body

    const session = await prisma.session.create({
      data: {
        tutorId,
        titre,
        matiere,
        classe,
        salle,
        enLigne: enLigne || false,
        lieu,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        notes,
        attendance: {
          create: {
            status: 'NON_MARQUE',
          },
        },
        sessionReport: {
          create: {
            contenu: '',
            status: 'BROUILLON',
          },
        },
      },
      include: {
        tutor: { include: { user: true } },
        attendance: true,
        sessionReport: true,
      },
    })
    return NextResponse.json(session)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
