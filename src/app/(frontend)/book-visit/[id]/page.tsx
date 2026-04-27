'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function BookVisitPage() {
  const params = useParams()
  const [booked, setBooked] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  if (booked) {
    return (
      <div className="bg-gray-50 min-h-screen pt-32 pb-20 flex flex-col items-center px-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Visit Confirmed</h1>
        <p className="text-gray-500 text-center max-w-md">Your try-out session has been successfully scheduled. You will receive an email with directions to the stable.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Schedule a Try-Out</h1>
          <p className="text-gray-500">Book a private viewing and try-out session for Asset #{params.id}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Info Side */}
          <div className="md:w-1/3 bg-primary text-white p-8">
            <h3 className="font-serif font-bold text-xl mb-6">Session Details</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Clock className="text-accent flex-shrink-0" />
                <div>
                  <p className="font-bold">Duration</p>
                  <p className="text-sm text-white/70">60 - 90 Minutes</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-accent flex-shrink-0" />
                <div>
                  <p className="font-bold">Location</p>
                  <p className="text-sm text-white/70">Equivest Main Stables<br/>Belgium</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CalendarIcon className="text-accent flex-shrink-0" />
                <div>
                  <p className="font-bold">Format</p>
                  <p className="text-sm text-white/70">1. Veterinary Briefing<br/>2. Conformation Viewing<br/>3. Saddle Try-Out</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Side */}
          <div className="md:w-2/3 p-8">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Select Date & Time</h3>
            
            {/* Fake Calendar Grid */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[12, 13, 14, 15, 16, 19, 20, 21].map(day => (
                <button 
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center justify-center ${
                    selectedDate === day 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-gray-100 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">Oct</span>
                  <span className="text-2xl font-bold">{day}</span>
                </button>
              ))}
            </div>

            {selectedDate && (
              <div className="animate-fade-in space-y-4">
                <h4 className="font-bold text-gray-900 mb-2">Available Slots for Oct {selectedDate}</h4>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <button className="py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors">09:00 AM</button>
                  <button className="py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors">11:30 AM</button>
                  <button className="py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors">02:00 PM</button>
                  <button className="py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors">04:30 PM</button>
                </div>
                
                <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent" />
                <input type="email" placeholder="Email Address" className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent" />
                
                <button onClick={() => setBooked(true)} className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-secondary transition-colors mt-4">
                  Confirm Booking
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
