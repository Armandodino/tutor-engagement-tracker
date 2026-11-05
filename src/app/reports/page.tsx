"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, FileText, CheckCircle, XCircle } from 'lucide-react'

export default function ReportsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions').then(r => r.json()).then(data => {
      setSessions(data)
      setLoading(false)
    })
  }, [])

  const handleReport = async (sessionId: string, status: string) => {
    await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, status }),
    })
    fetch('/api/sessions').then(r => r.json()).then(setSessions)
  }

  const updateReportContent = async (sessionId: string, contenu: string) => {
    await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, contenu, status: 'BROUILLON' }),
    })
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
              <Link href="/reports" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"><FileText className="w-4 h-4" /> Rapports</Link>
              <Link href="/engagement" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Engagement</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Comptes-rendus de séance</h2>
          <p className="text-gray-600">Suivi de la rédaction et validation des rapports</p>
        </div>

        <div className="space-y-4">
          {sessions.filter((s: any) => s.status === 'REALISEE' || s.sessionReport).map((s: any) => (
            <div key={s.id} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{s.titre}</h3>
                  <p className="text-sm text-gray-600">{s.tutor.user.firstName} {s.tutor.user.lastName} • {new Date(s.dateDebut).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  s.sessionReport?.status === 'VALIDE' ? 'bg-green-100 text-green-700' :
                  s.sessionReport?.status === 'SOUMIS' ? 'bg-blue-100 text-blue-700' :
                  s.sessionReport?.status === 'REFUSE' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {s.sessionReport?.status || 'BROUILLON'}
                </span>
              </div>
              <textarea
                defaultValue={s.sessionReport?.contenu || ''}
                onBlur={(e) => updateReportContent(s.id, e.target.value)}
                placeholder="Rédiger le compte-rendu de la séance..."
                className="w-full px-3 py-2 border rounded-lg mb-4 min-h-[100px]"
              />
              <div className="flex gap-2">
                <button onClick={() => handleReport(s.id, 'SOUMIS')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Soumettre
                </button>
                <button onClick={() => handleReport(s.id, 'VALIDE')} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  <CheckCircle className="w-3 h-3" /> Valider
                </button>
                <button onClick={() => handleReport(s.id, 'REFUSE')} className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                  <XCircle className="w-3 h-3" /> Refuser
                </button>
              </div>
            </div>
          ))}
          {sessions.filter((s: any) => s.status === 'REALISEE' || s.sessionReport).length === 0 && <p className="text-gray-500 text-center py-8">Aucun compte-rendu à traiter</p>}
        </div>
      </main>
    </div>
  )
}
