"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, Calendar, Plus } from 'lucide-react'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ tutorId: '', titre: '', matiere: '', classe: '', salle: '', enLigne: false, lieu: '', dateDebut: '', dateFin: '' })

  useEffect(() => {
    Promise.all([
      fetch('/api/sessions').then(r => r.json()),
      fetch('/api/tutors').then(r => r.json()),
    ]).then(([s, t]) => {
      setSessions(s)
      setTutors(t)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ tutorId: '', titre: '', matiere: '', classe: '', salle: '', enLigne: false, lieu: '', dateDebut: '', dateFin: '' })
    fetch('/api/sessions').then(r => r.json()).then(setSessions)
  }

  const handleAttendance = async (sessionId: string, status: string) => {
    await fetch('/api/attendance', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, status }),
    })
    fetch('/api/sessions').then(r => r.json()).then(setSessions)
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
              <Link href="/sessions" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"><Calendar className="w-4 h-4" /> Séances</Link>
              <Link href="/reports" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Rapports</Link>
              <Link href="/engagement" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Engagement</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des séances</h2>
            <p className="text-gray-600">Planifier, marquer présence et suivre</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Planifier une séance
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm mb-6 grid grid-cols-2 gap-4">
            <select value={form.tutorId} onChange={e => setForm({...form, tutorId: e.target.value})} className="px-3 py-2 border rounded-lg col-span-2" required>
              <option value="">Sélectionner un tuteur</option>
              {tutors.map((t: any) => <option key={t.id} value={t.id}>{t.user.firstName} {t.user.lastName}</option>)}
            </select>
            <input placeholder="Titre de la séance" value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} className="px-3 py-2 border rounded-lg col-span-2" required />
            <input placeholder="Matière" value={form.matiere} onChange={e => setForm({...form, matiere: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Classe/Groupe" value={form.classe} onChange={e => setForm({...form, classe: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <input type="datetime-local" value={form.dateDebut} onChange={e => setForm({...form, dateDebut: e.target.value})} className="px-3 py-2 border rounded-lg" required />
            <input type="datetime-local" value={form.dateFin} onChange={e => setForm({...form, dateFin: e.target.value})} className="px-3 py-2 border rounded-lg" required />
            <input placeholder="Salle" value={form.salle} onChange={e => setForm({...form, salle: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Lieu / Lien" value={form.lieu} onChange={e => setForm({...form, lieu: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <label className="flex items-center gap-2 col-span-2">
              <input type="checkbox" checked={form.enLigne} onChange={e => setForm({...form, enLigne: e.target.checked})} />
              En ligne
            </label>
            <button type="submit" className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Planifier</button>
          </form>
        )}

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Séance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Présence</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{s.titre}</p>
                    <p className="text-sm text-gray-500">{s.matiere} {s.classe && `• ${s.classe}`}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{s.tutor.user.firstName} {s.tutor.user.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(s.dateDebut).toLocaleDateString('fr-FR')} {new Date(s.dateDebut).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{s.enLigne ? 'En ligne' : s.salle || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      s.status === 'REALISEE' ? 'bg-green-100 text-green-700' :
                      s.status === 'PLANIFIEE' ? 'bg-blue-100 text-blue-700' :
                      s.status === 'ABSENTE' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      s.attendance?.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                      s.attendance?.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                      s.attendance?.status === 'RETARD' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {s.attendance?.status || 'NON_MARQUE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleAttendance(s.id, 'PRESENT')} className="text-green-600 hover:underline text-sm">Présent</button>
                    <button onClick={() => handleAttendance(s.id, 'RETARD')} className="text-orange-600 hover:underline text-sm">Retard</button>
                    <button onClick={() => handleAttendance(s.id, 'ABSENT')} className="text-red-600 hover:underline text-sm">Absent</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions.length === 0 && <p className="text-gray-500 text-center py-8">Aucune séance planifiée</p>}
        </div>
      </main>
    </div>
  )
}
