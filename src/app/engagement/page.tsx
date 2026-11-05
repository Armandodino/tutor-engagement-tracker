"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react'

export default function EngagementPage() {
  const [tutors, setTutors] = useState<any[]>([])
  const [scores, setScores] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [periode, setPeriode] = useState({
    debut: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fin: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetch('/api/tutors').then(r => r.json()).then(data => {
      setTutors(data)
      setLoading(false)
    })
  }, [])

  const calculerScore = async (tutorId: string) => {
    const res = await fetch(`/api/engagement?tutorId=${tutorId}&periodeDebut=${periode.debut}&periodeFin=${periode.fin}`)
    const data = await res.json()
    setScores({ ...scores, [tutorId]: data })
  }

  const getStatutColor = (statut: string) => {
    if (statut === 'EXCELLENT') return 'bg-green-100 text-green-700'
    if (statut === 'BON') return 'bg-blue-100 text-blue-700'
    if (statut === 'MOYEN') return 'bg-yellow-100 text-yellow-700'
    if (statut === 'FAIBLE') return 'bg-orange-100 text-orange-700'
    if (statut === 'CRITIQUE') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Suivi Engagement Tuteurs</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Tableau de bord</Link>
              <Link href="/tutors" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Tuteurs</Link>
              <Link href="/sessions" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Séances</Link>
              <Link href="/reports" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Rapports</Link>
              <Link href="/engagement" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"><BarChart3 className="w-4 h-4" /> Engagement</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Score d'engagement</h2>
          <p className="text-gray-600">Mesurer et analyser l'engagement de chaque tuteur</p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm mb-6 flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
            <input type="date" value={periode.debut} onChange={e => setPeriode({...periode, debut: e.target.value})} className="px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
            <input type="date" value={periode.fin} onChange={e => setPeriode({...periode, fin: e.target.value})} className="px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="space-y-4">
          {tutors.map((t: any) => (
            <div key={t.id} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-medium text-lg">{t.user.firstName[0]}{t.user.lastName[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t.user.firstName} {t.user.lastName}</h3>
                    <p className="text-sm text-gray-600">{t.matieres || 'Non spécifié'}</p>
                  </div>
                </div>
                <button onClick={() => calculerScore(t.id)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <TrendingUp className="w-4 h-4" /> Calculer le score
                </button>
              </div>

              {scores[t.id] && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900">{scores[t.id].scoreGlobal}/100</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(scores[t.id].statut)}`}>
                        {scores[t.id].statut}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Taux réalisation</p>
                      <p className="text-lg font-semibold">{scores[t.id].tauxRealisation}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Ponctualité</p>
                      <p className="text-lg font-semibold">{scores[t.id].ponctualiteMarquage}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Comptes-rendus</p>
                      <p className="text-lg font-semibold">{scores[t.id].compteRendus}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Régularité</p>
                      <p className="text-lg font-semibold">{scores[t.id].regularite}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Activité</p>
                      <p className="text-lg font-semibold">{scores[t.id].activite}%</p>
                    </div>
                  </div>
                  {scores[t.id].scoreGlobal < 60 && (
                    <div className="mt-4 flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <p className="text-sm text-orange-700">Tuteur peu engagé - Nécessite un suivi</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {tutors.length === 0 && <p className="text-gray-500 text-center py-8">Aucun tuteur pour calculer les scores</p>}
        </div>
      </main>
    </div>
  )
}
