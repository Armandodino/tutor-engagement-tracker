"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, Users, Plus, Mail, Phone } from 'lucide-react'

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: 'tutor123', phone: '', matieres: '', centre: '' })

  useEffect(() => {
    fetch('/api/tutors').then(r => r.json()).then(data => {
      setTutors(data)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/tutors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ firstName: '', lastName: '', email: '', password: 'tutor123', phone: '', matieres: '', centre: '' })
    fetch('/api/tutors').then(r => r.json()).then(setTutors)
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
              <Link href="/tutors" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"><Users className="w-4 h-4" /> Tuteurs</Link>
              <Link href="/sessions" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Séances</Link>
              <Link href="/reports" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Rapports</Link>
              <Link href="/engagement" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">Engagement</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des tuteurs</h2>
            <p className="text-gray-600">Liste et suivi des tuteurs</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Ajouter un tuteur
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm mb-6 grid grid-cols-2 gap-4">
            <input placeholder="Prénom" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="px-3 py-2 border rounded-lg" required />
            <input placeholder="Nom" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="px-3 py-2 border rounded-lg" required />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-3 py-2 border rounded-lg" required />
            <input placeholder="Téléphone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Matières" value={form.matieres} onChange={e => setForm({...form, matieres: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Centre" value={form.centre} onChange={e => setForm({...form, centre: e.target.value})} className="px-3 py-2 border rounded-lg" />
            <button type="submit" className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
          </form>
        )}

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matières</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Centre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Séances</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tutors.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-medium">{t.user.firstName[0]}{t.user.lastName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t.user.firstName} {t.user.lastName}</p>
                        <p className="text-sm text-gray-500">{t.user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3" />{t.user.email}</div>
                      {t.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" />{t.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.matieres || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.centre || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.sessions?.length || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/tutors/${t.id}`} className="text-blue-600 hover:underline text-sm">Voir profil</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tutors.length === 0 && <p className="text-gray-500 text-center py-8">Aucun tuteur enregistré</p>}
        </div>
      </main>
    </div>
  )
}
