'use client'

import { useState, useEffect } from 'react'
import { getReferences, addReference, deleteReference, updateReference } from '@/app/actions/reference'
import { Plus, Trash2, Camera, Edit2, X, Save } from 'lucide-react'

export default function AdminReferences() {
  const [references, setReferences] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    loadReferences()
  }, [])

  const loadReferences = async () => {
    setIsLoading(true)
    const data = await getReferences()
    setReferences(data || [])
    setIsLoading(false)
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await addReference(formData)

    if (res.error) {
      setError(res.error)
    } else {
      ;(e.target as HTMLFormElement).reset()
      await loadReferences()
    }
    
    setIsSubmitting(false)
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const res = await updateReference(id, formData)
    
    if (res.error) {
      alert(res.error)
    } else {
      setEditId(null)
      await loadReferences()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reference?')) return
    await deleteReference(id)
    await loadReferences()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Instagram References</h1>
        <a 
          href="https://www.instagram.com/nomoregrayarea36/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm"
        >
          <Camera size={18} />
          Go to my Instagram
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <Camera className="text-pink-600" />
              Add Reference
            </h2>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram Post URL</label>
                <input 
                  name="url"
                  type="url" 
                  placeholder="https://www.instagram.com/p/..."
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referentie tekst / Paard naam</label>
                <input 
                  name="property_name"
                  type="text" 
                  placeholder="e.g. Grand Prix Star"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-secondary text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : <><Plus size={20} /> Add Reference</>}
              </button>
            </form>
          </div>
        </div>

        {/* References List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Preview / URL</th>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Referentie / Name</th>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">Loading references...</td></tr>
                  ) : references.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No references added yet.</td></tr>
                  ) : (
                    references.map((ref) => (
                      <tr key={ref.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {editId === ref.id ? (
                          <td colSpan={3} className="p-4">
                            <form onSubmit={(e) => handleEdit(e, ref.id)} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                              <input 
                                name="url" 
                                type="url" 
                                defaultValue={ref.url} 
                                required 
                                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                              <input 
                                name="property_name" 
                                type="text" 
                                defaultValue={ref.property_name} 
                                placeholder="Referentie tekst"
                                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                              />
                              <div className="flex gap-2">
                                <button type="submit" disabled={isSubmitting} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center">
                                  <Save size={20} />
                                </button>
                                <button type="button" onClick={() => setEditId(null)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                                  <X size={20} />
                                </button>
                              </div>
                            </form>
                          </td>
                        ) : (
                          <>
                            <td className="p-4">
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                                <Camera size={16} /> View Post
                              </a>
                            </td>
                            <td className="p-4 font-medium text-gray-900 dark:text-white">
                              {ref.property_name || <span className="text-gray-400 italic">None</span>}
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => setEditId(ref.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mr-2"
                                title="Edit Reference"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button 
                                onClick={() => handleDelete(ref.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Reference"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
