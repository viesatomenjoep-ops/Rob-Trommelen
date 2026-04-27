'use client'

import { useEffect, useState } from 'react'
import { getAppointments, updateAppointmentStatus } from '@/app/actions/appointments'
import { Calendar, Clock, Phone, Mail, User, Check, X } from 'lucide-react'

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    const data = await getAppointments()
    setAppointments(data)
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status)
      // Optimistic update
      setAppointments(appointments.map(app => app.id === id ? { ...app, status } : app))
    } catch (err) {
      console.error(err)
      alert("Er ging iets mis bij het updaten van de status.")
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary dark:text-white">Visits & Appointments</h1>
        <p className="text-gray-500 mt-1">Manage requests for viewings and visits from the website.</p>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Aanvragen laden...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Geen Afspraken</h3>
          <p className="mt-1 text-gray-500">Er zijn nog geen bezoekaanvragen binnengekomen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 flex flex-col transition-colors ${
                appointment.status === 'confirmed' ? 'border-green-200 dark:border-green-900 shadow-green-100/20' : 
                appointment.status === 'cancelled' ? 'border-red-200 dark:border-red-900 opacity-70' : 
                'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {appointment.status === 'pending' ? 'Wacht op reactie' : 
                   appointment.status === 'confirmed' ? 'Bevestigd' : 'Geannuleerd'}
                </span>
                
                {/* Actions */}
                {appointment.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                      className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                      title="Bevestigen"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      title="Annuleren"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-1">
                <User size={18} className="mr-2 text-gray-400" />
                {appointment.client_name}
              </h3>
              
              <div className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 flex-1">
                <div className="flex items-center gap-2 font-medium text-primary dark:text-accent bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                  <Calendar size={16} />
                  {new Date(appointment.appointment_date).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 font-medium text-primary dark:text-accent bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                  <Clock size={16} />
                  {appointment.appointment_time}
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${appointment.client_email}`} className="hover:text-accent hover:underline">{appointment.client_email}</a>
                  </div>
                  {appointment.client_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${appointment.client_phone}`} className="hover:text-accent hover:underline">{appointment.client_phone}</a>
                    </div>
                  )}
                </div>

                {appointment.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Opmerkingen:</span>
                    <p className="mt-1 italic text-gray-700 dark:text-gray-400">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
