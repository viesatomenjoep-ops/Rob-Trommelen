'use client'

import { useState } from 'react'
import { addEmployee } from '@/app/actions/staff'

export default function AddStaffForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    const res = await addEmployee(formData)
    if (res?.error) {
      setError(res.error)
    } else {
      // Clear form on success
      const form = document.getElementById('add-staff-form') as HTMLFormElement
      if (form) form.reset()
    }
    setLoading(false)
  }

  return (
    <div>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
      <form id="add-staff-form" action={handleSubmit} className="flex gap-4 mb-6">
        <input type="text" name="full_name" placeholder="Full Name" required className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
        <input type="text" name="pin_code" placeholder="4-Digit PIN" required pattern="[0-9]{4}" title="Four digit PIN code" className="w-32 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors text-sm font-medium disabled:opacity-50">
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  )
}
