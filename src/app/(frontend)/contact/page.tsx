'use client'

import { useState } from 'react'
import { createLead } from '@/app/actions/lead'
import { createAppointment } from '@/app/actions/appointments'
import { Loader2, Mail, MapPin, Phone, Calendar, Clock, User, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
    const result = await createLead(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      setSuccess(true)
      setIsSubmitting(false)
      ;(event.target as HTMLFormElement).reset()
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError(null)
    try {
      const formData = new FormData(e.currentTarget)
      await createAppointment(formData)
      setBookingSuccess(true)
    } catch (err: any) {
      console.error(err)
      setBookingError("Something went wrong. Please try again later.")
    }
    setBookingLoading(false)
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center space-y-8 mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-primary dark:text-white">
          Get in <span className="font-semibold italic text-accent">Touch</span>
        </h1>
        <p className="text-lg text-secondary dark:text-gray-400 font-light max-w-2xl mx-auto">
          Whether you are looking to purchase a world-class athlete, or require expert representation for your property, we are here to assist.
        </p>
      </div>

      {/* Plan a Visit Section */}
      <div className="mb-24" id="plan-visit">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary dark:text-white tracking-tight mb-4">
            Plan a Visit
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Would you like to visit us to view our properties or discuss investment opportunities? Fill out the form below and we will schedule an appointment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-primary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Calendar size={150} />
              </div>
              <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-primary-content/80">
                <li className="flex justify-between"><span>Mon - Fri:</span> <span>09:00 - 17:00</span></li>
                <li className="flex justify-between"><span>Saturday:</span> <span>10:00 - 14:00</span></li>
                <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary dark:text-white mb-4">Visit Requested!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Thank you for your request. We have received it successfully and will contact you shortly to confirm the appointment.
                </p>
                <button 
                  onClick={() => setBookingSuccess(false)} 
                  className="px-6 py-3 bg-accent text-white font-bold uppercase tracking-wider text-sm rounded-md hover:bg-primary transition-colors"
                >
                  New Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {bookingError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800">
                    {bookingError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      <User size={16} className="mr-2 text-accent" /> Name *
                    </label>
                    <input required name="clientName" type="text" placeholder="Full name" className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      <Mail size={16} className="mr-2 text-accent" /> Email *
                    </label>
                    <input required name="clientEmail" type="email" placeholder="your@email.com" className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      <Phone size={16} className="mr-2 text-accent" /> Phone
                    </label>
                    <input name="clientPhone" type="tel" placeholder="+1 234 567 8900" className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      <Calendar size={16} className="mr-2 text-accent" /> Preferred Date *
                    </label>
                    <input required name="appointmentDate" type="date" min={new Date().toISOString().split('T')[0]} className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-gray-900 dark:text-gray-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      <Clock size={16} className="mr-2 text-accent" /> Time *
                    </label>
                    <select required name="appointmentTime" className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-gray-900 dark:text-gray-100 appearance-none">
                      <option value="">Select a time</option>
                      <option value="09:00 - 10:00">09:00 - 10:00</option>
                      <option value="10:00 - 11:00">10:00 - 11:00</option>
                      <option value="11:00 - 12:00">11:00 - 12:00</option>
                      <option value="13:00 - 14:00">13:00 - 14:00</option>
                      <option value="14:00 - 15:00">14:00 - 15:00</option>
                      <option value="15:00 - 16:00">15:00 - 16:00</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    What would you like to visit us for? (Optional)
                  </label>
                  <textarea name="notes" rows={4} placeholder="e.g., viewing a specific property, discussing an investment..." className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all resize-none"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="w-full py-4 bg-accent text-white font-bold text-lg rounded-xl hover:bg-primary transition-all disabled:opacity-50 disabled:scale-100 active:scale-[0.98] shadow-lg shadow-accent/30"
                >
                  {bookingLoading ? 'Submitting...' : 'Confirm Visit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-serif font-semibold text-primary dark:text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <a href="https://wa.me/15613010984" target="_blank" rel="noopener noreferrer" className="flex items-start group">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
                   <Phone size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-accent transition-colors">Chat via WhatsApp</p>
                  <p className="text-gray-600 dark:text-gray-400">+1 (561) 301-0984</p>
                </div>
              </a>
              <a href="mailto:equivestbv@gmail.com" className="flex items-start group">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
                   <Mail size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-accent transition-colors">Send an Email</p>
                  <p className="text-gray-600 dark:text-gray-400">equivestbv@gmail.com</p>
                </div>
              </a>
              <a href="https://www.instagram.com/nomoregrayarea36" target="_blank" rel="noopener noreferrer" className="flex items-start group">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-accent transition-colors">Instagram</p>
                  <p className="text-gray-600 dark:text-gray-400">Follow Us</p>
                </div>
              </a>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 text-accent shrink-0">
                   <MapPin size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">Huikvenweg 8<br/>2990 Wuustwezel<br/><span className="italic text-sm">(on the premises of APG Stables)</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden relative shadow-inner">
            <iframe 
               src="https://maps.google.com/maps?q=Huikvenweg%208,%202990%20Wuustwezel&t=&z=14&ie=UTF8&iwloc=&output=embed" 
               style={{ border: 0 }} 
               allowFullScreen={false} 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="absolute inset-0 w-full h-full grayscale-[20%] contrast-[1.1] opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-serif font-semibold text-primary dark:text-white mb-6">Send an Inquiry</h3>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm font-medium border border-green-200 dark:border-green-800">
              Thank you for your message. We will get back to you shortly.
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <input required type="text" name="client_name" id="client_name" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-accent focus:ring-accent sm:text-sm" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input required type="email" name="email" id="email" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-accent focus:ring-accent sm:text-sm" />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" name="phone_number" id="phone_number" className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-accent focus:ring-accent sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
              <textarea required name="message" id="message" rows={5} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-accent focus:ring-accent sm:text-sm" placeholder="How can we help you?"></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
