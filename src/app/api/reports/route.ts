import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { sessionId, contenu, objectifs, difficultes, travauxARealiser, status, valideParId, commentaireValidation } = body

    const updateData: any = {
      contenu,
      objectifs,
      difficultes,
      travauxARealiser,
    }

    if (status === 'SOUMIS') {
      updateData.status = 'SOUMIS'
      updateData.soumisAt = new Date()
    } else if (status === 'VALIDE') {
      updateData.status = 'VALIDE'
      updateData.valideAt = new Date()
      updateData.valideParId = valideParId
      updateData.commentaireValidation = commentaireValidation
    } else if (status === 'REFUSE') {
      updateData.status = 'REFUSE'
      updateData.valideParId = valideParId
      updateData.commentaireValidation = commentaireValidation
    } else if (status === 'BROUILLON') {
      updateData.status = 'BROUILLON'
    }

    const report = await prisma.sessionReport.upsert({
      where: { sessionId },
      update: updateData,
      create: {
        sessionId,
        contenu: contenu || '',
        objectifs,
        difficultes,
        travauxARealiser,
        status: status || 'BROUILLON',
        soumisAt: status === 'SOUMIS' ? new Date() : null,
      },
    })

    return NextResponse.json(report)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
