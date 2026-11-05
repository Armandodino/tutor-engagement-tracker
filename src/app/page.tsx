"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Users, Calendar, FileText, Award, Home } from 'lucide-react'

export default function Home() {
  const [tutors, setTutors] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tutors').then(r => r.json()),
      fetch('/api/sessions').then(r => r.json()),
    ]).then(([t, s]) => {
      setTutors(t)
      setSessions(s)
      setLoading(false)
    })
  }, [])

  const stats = {
    totalTutors: tutors.length,
    totalSessions: sessions.length,
    realisees: sessions.filter((s: any) => s.status === 'REALISEE').length,
    enAttenteRapport: sessions.filter((s: any) => s.sessionReport?.status === 'BROUILLON' && s.status === 'REALISEE').length,
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
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
              <Link href="/" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <Home className="w-4 h-4" /> Tableau de bord
              </Link>
              <Link href="/tutors" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <Users className="w-4 h-4" /> Tuteurs
              </Link>
              <Link href="/sessions" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4" /> Séances
              </Link>
              <Link href="/reports" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <FileText className="w-4 h-4" /> Rapports
              </Link>
              <Link href="/engagement" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <BarChart3 className="w-4 h-4" /> Engagement
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
          <p className="text-gray-600">Vue d'ensemble de l'engagement des tuteurs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tuteurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTutors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Séances totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Séances réalisées</p>
                <p className="text-2xl font-bold text-green-600">{stats.realisees}</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rapports en attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.enAttenteRapport}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Tuteurs récents</h3>
            </div>
            <div className="p-6">
              {tutors.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{t.user.firstName} {t.user.lastName}</p>
                    <p className="text-sm text-gray-600">{t.matiere || t.matieres || 'Non spécifié'}</p>
                  </div>
                  <Link href={`/tutors/${t.id}`} className="text-blue-600 hover:underline text-sm">
                    Voir détail
                  </Link>
                </div>
              ))}
              {tutors.length === 0 && <p className="text-gray-500 text-center py-4">Aucun tuteur</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Dernières séances</h3>
            </div>
            <div className="p-6">
              {sessions.slice(0, 5).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{s.titre}</p>
                    <p className="text-sm text-gray-600">{s.tutor.user.firstName} {s.tutor.user.lastName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    s.status === 'REALISEE' ? 'bg-green-100 text-green-700' :
                    s.status === 'PLANIFIEE' ? 'bg-blue-100 text-blue-700' :
                    s.status === 'ABSENTE' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
              {sessions.length === 0 && <p className="text-gray-500 text-center py-4">Aucune séance</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
