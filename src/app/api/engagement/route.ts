import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tutorId = searchParams.get('tutorId')
    const periodeDebut = searchParams.get('periodeDebut')
    const periodeFin = searchParams.get('periodeFin')

    if (!tutorId || !periodeDebut || !periodeFin) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const debut = new Date(periodeDebut)
    const fin = new Date(periodeFin)

    const sessions = await prisma.session.findMany({
      where: {
        tutorId,
        dateDebut: {
          gte: debut,
          lte: fin,
        },
      },
      include: {
        attendance: true,
        sessionReport: true,
      },
    })

    const total = sessions.length
    if (total === 0) {
      return NextResponse.json({
        tauxRealisation: 0,
        ponctualiteMarquage: 0,
        compteRendus: 0,
        regularite: 0,
        activite: 0,
        scoreGlobal: 0,
        statut: 'AUCUNE_ACTIVITE',
        details: { total: 0, realisees: 0, avecRapport: 0, rapportsSoumisTemps: 0 },
      })
    }

    const realisees = sessions.filter(s => s.status === 'REALISEE' || (s.attendance && s.attendance.status === 'PRESENT' || s.attendance?.status === 'RETARD')).length
    const avecRapport = sessions.filter(s => s.sessionReport && s.sessionReport.contenu && s.sessionReport.contenu.trim().length > 0).length
    const rapportsSoumis = sessions.filter(s => s.sessionReport && (s.sessionReport.status === 'SOUMIS' || s.sessionReport.status === 'VALIDE')).length

    const tauxRealisation = Math.round((realisees / total) * 100)
    const compteRendus = Math.round((rapportsSoumis / total) * 100)
    const ponctualiteMarquage = Math.round((realisees / total) * 100) // simplifié
    const regularite = Math.min(100, Math.round((total / Math.max(1, Math.ceil((fin.getTime()-debut.getTime())/(1000*3600*24*7)))) * 100))
    const activite = Math.round(((realisees + rapportsSoumis) / (total * 2)) * 100)

    const scoreGlobal = Math.round((tauxRealisation * 0.25 + ponctualiteMarquage * 0.20 + compteRendus * 0.25 + regularite * 0.15 + activite * 0.15))
    
    let statut = 'MOYEN'
    if (scoreGlobal >= 90) statut = 'EXCELLENT'
    else if (scoreGlobal >= 75) statut = 'BON'
    else if (scoreGlobal >= 60) statut = 'MOYEN'
    else if (scoreGlobal >= 40) statut = 'FAIBLE'
    else statut = 'CRITIQUE'

    const score = await prisma.engagementScore.create({
      data: {
        tutorId,
        periodeDebut: debut,
        periodeFin: fin,
        tauxRealisation,
        ponctualiteMarquage,
        compteRendus,
        regularite,
        activite,
        scoreGlobal,
        statut,
      },
    })

    return NextResponse.json({
      ...score,
      details: { total, realisees, avecRapport, rapportsSoumis },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
