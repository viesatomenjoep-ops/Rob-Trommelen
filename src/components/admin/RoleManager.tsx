'use client'

import { useState, useEffect } from 'react'
import { getAllStaffPermissions, addStaffMember, updateStaffPermissions, removeStaffMember, getCurrentUserPermissions } from '@/app/actions/permissions'
import { ShieldAlert, Trash2, Plus, Save, UserCheck } from 'lucide-react'

// Define the available modules in the CMS
const MODULES = [
  { id: 'properties', label: 'Paarden / Portfolio' },
  { id: 'inventory', label: 'Voorraadbeheer' },
  { id: 'quotes', label: 'Offertes & Orders' },
  { id: 'appointments', label: 'Bezoeken & Afspraken' },
  { id: 'references', label: 'Referenties' },
  { id: 'news', label: 'Nieuws & Blog' },
  { id: 'leads', label: 'Leads & Contacten' },
  { id: 'team', label: 'Teamleden (Website)' },
  { id: 'staff', label: 'Personeel & Uren (Kiosk)' },
]

export default function RoleManager() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllStaffPermissions()
      setUsers(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Geen toegang tot rollen en rechten.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail) return
    try {
      await addStaffMember(newEmail)
      setNewEmail('')
      await fetchUsers()
    } catch (err: any) {
      alert(err.message || 'Error adding user')
    }
  }

  const handleTogglePermission = async (userId: string, currentPermissions: any, module_id: string, isGranted: boolean) => {
    setSavingId(userId)
    const newPermissions = { ...currentPermissions }
    
    if (isGranted) {
      newPermissions[module_id] = true
    } else {
      newPermissions[module_id] = false
    }

    try {
      await updateStaffPermissions(userId, newPermissions)
      // Optimistically update UI
      setUsers(users.map(u => u.id === userId ? { ...u, permissions: newPermissions } : u))
    } catch (err: any) {
      alert(err.message || 'Error updating permissions')
      await fetchUsers() // revert
    }
    setSavingId(null)
  }

  const handleDeleteUser = async (id: string, role: string) => {
    if (role === 'superadmin') {
      alert("Super Admins kunnen hier niet worden verwijderd.")
      return
    }
    if (confirm("Weet je zeker dat je deze gebruiker de toegang tot het CMS wilt ontnemen?")) {
      try {
        await removeStaffMember(id)
        await fetchUsers()
      } catch (err: any) {
        alert(err.message || 'Error deleting user')
      }
    }
  }

  if (loading) return <div className="p-8 text-center">Laden...</div>
  if (error) return (
    <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3">
      <ShieldAlert />
      <p>{error}</p>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Add New User */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nieuwe Gebruiker Toevoegen</h3>
        <p className="text-sm text-gray-500 mb-4">
          Voeg het e-mailadres toe van de medewerker. Zodra ze via Supabase inloggen met dit e-mailadres, krijgen ze toegang tot de door jou geselecteerde modules.
        </p>
        <form onSubmit={handleAddUser} className="flex gap-4">
          <input 
            type="email" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="medewerker@equivest.com" 
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none"
            required
          />
          <button type="submit" className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
            <Plus size={18} /> Toevoegen
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="space-y-6">
        {users.map(user => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{user.email}</h4>
                  <span className={`text-xs font-bold uppercase tracking-wider ${user.role === 'superadmin' ? 'text-accent' : 'text-gray-500'}`}>
                    {user.role === 'superadmin' ? 'Super Admin' : 'Medewerker (Staff)'}
                  </span>
                </div>
              </div>

              {user.role !== 'superadmin' && (
                <button 
                  onClick={() => handleDeleteUser(user.id, user.role)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Toegang Ontnemen"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Sliders / Toggles */}
            <div className="p-6">
              {user.role === 'superadmin' ? (
                <div className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-400 font-medium text-sm">
                    Deze gebruiker is een Super Admin en heeft automatisch altijd toegang tot alle huidige én toekomstige functies.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h5 className="font-bold text-gray-700 dark:text-gray-300">Bevoegdheden / Toegang</h5>
                    {savingId === user.id && <span className="text-xs text-accent animate-pulse flex items-center gap-1"><Save size={12} /> Opslaan...</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                    {MODULES.map(module => {
                      const hasAccess = user.permissions?.[module.id] === true
                      
                      return (
                        <div key={module.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{module.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={hasAccess}
                              onChange={(e) => handleTogglePermission(user.id, user.permissions || {}, module.id, e.target.checked)}
                              disabled={savingId === user.id}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}
