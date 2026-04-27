'use client'

import { useState } from 'react'
import { Plane, Calculator, MapPin, ShieldCheck, Euro } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function TransportCalculatorPage() {
  const params = useParams()
  const [destination, setDestination] = useState('USA')
  
  // Dummy rates
  const rates: any = {
    'USA': { flight: 8500, quarantine: 2500, importTax: '2.5%' },
    'UAE': { flight: 7000, quarantine: 1000, importTax: '5%' },
    'UK': { flight: 1200, quarantine: 0, importTax: '20%' },
    'China': { flight: 12000, quarantine: 4000, importTax: '10%' }
  }

  const selectedRate = rates[destination]

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Global Transport Estimate</h1>
          <p className="text-gray-500">Calculate shipping, quarantine, and import duties for Asset #{params.id}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
            <MapPin className="text-primary" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destination Country</label>
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white border-gray-300 rounded-lg focus:ring-accent focus:border-accent font-bold text-gray-900"
              >
                <option value="USA">United States of America</option>
                <option value="UAE">United Arab Emirates</option>
                <option value="UK">United Kingdom</option>
                <option value="China">China</option>
              </select>
            </div>
          </div>

          <div className="p-8">
            <h3 className="font-bold text-gray-900 mb-6 text-lg border-b pb-2">Estimated Costs</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Plane className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">Flight & Ground Transport</span>
                </div>
                <span className="font-bold text-gray-900">€{selectedRate.flight.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">CEM Quarantine (Estimated)</span>
                </div>
                <span className="font-bold text-gray-900">€{selectedRate.quarantine.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Euro className="text-gray-400" size={20} />
                  <span className="font-medium text-gray-700">Import Duties / Taxes</span>
                </div>
                <span className="font-bold text-gray-900">{selectedRate.importTax} of value</span>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4">
              <Calculator className="text-blue-500 flex-shrink-0" size={24} />
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>Disclaimer:</strong> This is a rough estimate based on current market rates for a gelding/mare. Stallions require extended quarantine. Actual costs will be finalized by our logistics partner (e.g., Peden Bloodstock) upon signing the purchase agreement.
              </p>
            </div>

            <button className="w-full mt-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors">
              Request Official Logistics Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
