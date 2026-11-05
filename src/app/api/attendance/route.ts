import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { sessionId, status, markedById, motifAbsence, commentaire, arriveAt } = body

    const attendance = await prisma.attendance.upsert({
      where: { sessionId },
      update: {
        status,
        markedById,
        markedAt: new Date(),
        arriveAt: arriveAt ? new Date(arriveAt) : null,
        motifAbsence,
        commentaire,
      },
      create: {
        sessionId,
        status,
        markedById,
        markedAt: new Date(),
        arriveAt: arriveAt ? new Date(arriveAt) : null,
        motifAbsence,
        commentaire,
      },
    })

    // Mettre à jour le statut de la séance
    if (status === 'PRESENT' || status === 'RETARD') {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: 'REALISEE' },
      })
    } else if (status === 'ABSENT') {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: 'ABSENTE' },
      })
    }

    return NextResponse.json(attendance)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
