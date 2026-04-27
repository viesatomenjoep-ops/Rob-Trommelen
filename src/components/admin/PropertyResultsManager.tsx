'use client'

import { useState, useEffect } from 'react'
import { getPropertyResults, addPropertyResult, deletePropertyResult } from '@/app/actions/property_results'
import { Plus, Trash2, Video, Trophy } from 'lucide-react'

export default function PropertyResultsManager({ propertyId }: { propertyId: string }) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchResults()
  }, [propertyId])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const data = await getPropertyResults(propertyId)
      setResults(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('propertyId', propertyId)
    
    try {
      await addPropertyResult(formData)
      e.currentTarget.reset()
      await fetchResults()
      setIsAdding(false)
    } catch (err) {
      console.error(err)
      alert("Error adding result")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Weet je zeker dat je dit resultaat wilt verwijderen?")) {
      try {
        await deletePropertyResult(id, propertyId)
        await fetchResults()
      } catch (err) {
        console.error(err)
        alert("Error deleting result")
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Trophy className="mr-2 text-accent" /> Wedstrijdresultaten
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center text-sm bg-accent text-white px-3 py-1.5 rounded hover:bg-primary transition-colors"
        >
          <Plus size={16} className="mr-1" /> Nieuw Resultaat
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Datum *</label>
              <input required type="date" name="date" className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Wedstrijd/Evenement *</label>
              <input required type="text" name="eventName" placeholder="bijv. CSI** Valkenswaard" className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Niveau (Level) *</label>
              <input required type="text" name="level" placeholder="bijv. 1.40m" className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Resultaat *</label>
              <input required type="text" name="result" placeholder="bijv. Foutloos / 1e Plaats" className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Video URL (Optioneel)</label>
            <input type="url" name="videoUrl" placeholder="https://youtube.com/..." className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-secondary">Toevoegen</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Laden...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Nog geen wedstrijdresultaten toegevoegd voor dit paard.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evenement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultaat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actie</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{new Date(r.date).toLocaleDateString('nl-NL')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{r.event_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{r.level}</td>
                  <td className="px-4 py-3 text-sm font-medium text-accent">{r.result}</td>
                  <td className="px-4 py-3 text-sm">
                    {r.video_url ? (
                      <a href={r.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                        <Video size={18} />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
