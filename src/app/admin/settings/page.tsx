'use client'

import { useState } from 'react'
import { Building2, ShieldCheck, Clock, Save, Lock, Users } from 'lucide-react'
import { updateAdminPassword } from '@/app/actions/settings'
import RoleManager from '@/components/admin/RoleManager'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  
  // Password State
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState(false)
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false)

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved successfully!')
    }, 800)
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPwdError('')
    setPwdSuccess(false)
    setIsUpdatingPwd(true)

    const formData = new FormData(e.currentTarget)
    const res = await updateAdminPassword(formData)

    if (res.error) {
      setPwdError(res.error)
    } else {
      setPwdSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    }
    
    setIsUpdatingPwd(false)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Platform Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'general' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Building2 size={20} />
              General Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'security' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ShieldCheck size={20} />
              Security & Access
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'roles' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Users size={20} />
              Rechten & Rollen
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'staff' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Clock size={20} />
              Staff Portal Config
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Company Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Update your business details and contact information displayed on the public website.</p>
              </div>
              <form onSubmit={handleSaveGeneral} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input type="text" defaultValue="Equivest Sport Properties" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
                    <input type="email" defaultValue="info@equivestworldwide.com" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" defaultValue="+31 6 12 34 56 78" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Currency</label>
                    <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>EUR (€)</option>
                      <option>USD ($)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                    {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lock className="text-primary" />
                  Admin Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">Change the password used to log into this CMS dashboard.</p>
              </div>
              
              <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
                {pwdError && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{pwdError}</div>}
                {pwdSuccess && <div className="p-4 bg-green-50 text-green-600 rounded-lg text-sm">Password updated successfully!</div>}
                
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input 
                      type="password" 
                      name="new_password"
                      required
                      minLength={6}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirm_password"
                      required
                      minLength={6}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" disabled={isUpdatingPwd} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                    {isUpdatingPwd ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ROLES & PERMISSIONS */}
          {activeTab === 'roles' && (
            <RoleManager />
          )}

          {/* STAFF CONFIG SETTINGS */}
          {activeTab === 'staff' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Staff Portal Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Configure how the iPad kiosk and staff time tracking behave.</p>
              </div>
              <form onSubmit={handleSaveGeneral} className="p-6 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Auto Clock-Out at Midnight</h3>
                      <p className="text-sm text-gray-500">Automatically clocks out any staff member who forgets to clock out at the end of the day.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Require Location Verification</h3>
                      <p className="text-sm text-gray-500">Staff can only clock in if their device location matches the stable coordinates.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                    {isSaving ? 'Saving...' : <><Save size={18} /> Save Preferences</>}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
