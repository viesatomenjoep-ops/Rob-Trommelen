'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, Info } from 'lucide-react'
import Image from 'next/image'

export default function RoiClient({ property }: { property: any }) {
  // Convert "€100k - €150k" or something similar to a base number
  // For the demo, we just use a default 100000 if parsing fails
  let initialInvestment = 100000
  if (property.price_category) {
    const match = property.price_category.match(/\d+/)
    if (match) initialInvestment = parseInt(match[0]) * 1000
  }

  const [investment, setInvestment] = useState(initialInvestment)
  const [holdingPeriod, setHoldingPeriod] = useState(24) // months
  const [monthlyCost, setMonthlyCost] = useState(1500) // stable/training
  const [projectedValue, setProjectedValue] = useState(initialInvestment * 1.8) // 80% growth default

  const totalCosts = monthlyCost * holdingPeriod
  const totalInvested = investment + totalCosts
  const grossProfit = projectedValue - totalInvested
  const roiPercentage = ((projectedValue - totalInvested) / totalInvested) * 100

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="grid md:grid-cols-2">
        {/* Left Side: Property Info & Sliders */}
        <div className="p-8 border-r border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden relative border-2 border-accent">
              <Image src={property.cover_image_url || '/logo.png'} alt={property.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">{property.name}</h2>
              <p className="text-sm text-gray-500">{property.discipline} • {property.experience_level}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300">Initial Investment</label>
                <span className="text-accent font-bold">€{investment.toLocaleString()}</span>
              </div>
              <input type="range" min="50000" max="500000" step="10000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300">Holding Period (Months)</label>
                <span className="text-accent font-bold">{holdingPeriod} Months</span>
              </div>
              <input type="range" min="6" max="60" step="6" value={holdingPeriod} onChange={(e) => setHoldingPeriod(Number(e.target.value))} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300">Monthly Training/Board</label>
                <span className="text-accent font-bold">€{monthlyCost.toLocaleString()}/mo</span>
              </div>
              <input type="range" min="1000" max="3500" step="100" value={monthlyCost} onChange={(e) => setMonthlyCost(Number(e.target.value))} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300">Projected Sale Value</label>
                <span className="text-green-600 font-bold">€{projectedValue.toLocaleString()}</span>
              </div>
              <input type="range" min={investment} max="1000000" step="25000" value={projectedValue} onChange={(e) => setProjectedValue(Number(e.target.value))} className="w-full accent-green-600" />
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="bg-gray-50 dark:bg-gray-900 p-8 flex flex-col justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Calculator size={16}/> Total Capital Outlay</h3>
            <p className="text-3xl font-serif font-bold text-primary dark:text-white">€{totalInvested.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Investment + ({holdingPeriod} mo × €{monthlyCost})</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><TrendingUp size={16}/> Projected Net Profit</h3>
            <p className={`text-4xl font-serif font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {grossProfit >= 0 ? '+' : ''}€{grossProfit.toLocaleString()}
            </p>
          </div>

          <div className="bg-primary text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
              <TrendingUp size={120} />
            </div>
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1">Estimated ROI</h3>
            <p className="text-5xl font-serif font-bold">{roiPercentage.toFixed(1)}%</p>
          </div>

          <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <p>This is a projection based on market averages and does not constitute financial advice. Property investments carry inherent risks.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
