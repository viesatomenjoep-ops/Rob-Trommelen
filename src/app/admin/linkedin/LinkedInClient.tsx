'use client'

import { useState } from 'react'
import { Copy, ExternalLink, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react'

export default function LinkedInClient({ properties }: { properties: any[] }) {
  const [leadName, setLeadName] = useState('')
  const [leadUrl, setLeadUrl] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [language, setLanguage] = useState('nl')
  const [copied, setCopied] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState('')

  const handleGenerate = () => {
    if (!leadName) return

    const property = properties.find(h => h.id === selectedPropertyId)
    let message = ''

    if (language === 'nl') {
      message = `Beste ${leadName.split(' ')[0]},\n\nIk zag je profiel en was onder de indruk van je achtergrond. Als partner bij Equivest ben ik dagelijks bezig met high-yield investeringen in topsportpaarden.\n\n`
      if (property) {
        message += `Op dit moment hebben we een exceptionele kans in onze portefeuille: ${property.name}. `
        if (property.estimated_roi) message += `Dit profiel toont een verwacht rendement van ${property.estimated_roi}. `
        message += `\n\nZou je open staan voor een korte, vrijblijvende kennismaking om te kijken of deze vorm van tastbare investeringen in topsport interessant voor je is?\n\nMet vriendelijke groet,\nTom van Biene\nEquivest Portfolio Management`
      } else {
        message += `Zou je open staan voor een korte virtuele kennismaking om te sparren over de voordelen van investeren in tastbare topsport-assets als alternatief rendement?\n\nMet vriendelijke groet,\nTom van Biene\nEquivest Portfolio Management`
      }
    } else {
      message = `Hi ${leadName.split(' ')[0]},\n\nI came across your profile and was impressed by your background. As a partner at Equivest, I specialize in high-yield alternative investments in elite showjumpers.\n\n`
      if (property) {
        message += `We currently have an exceptional opportunity in our portfolio: ${property.name}. `
        if (property.estimated_roi) message += `This prospect has an estimated ROI of ${property.estimated_roi}. `
        message += `\n\nWould you be open to a brief, no-obligation introduction to explore if tangible investments in elite sports align with your strategy?\n\nBest regards,\nTom van Biene\nEquivest Portfolio Management`
      } else {
        message += `Would you be open to a brief virtual introduction to discuss the benefits of investing in tangible elite sports assets as an alternative yield strategy?\n\nBest regards,\nTom van Biene\nEquivest Portfolio Management`
      }
    }

    setGeneratedMessage(message)
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const openLinkedIn = () => {
    if (leadUrl && leadUrl.includes('linkedin.com')) {
      window.open(leadUrl, '_blank')
    } else {
      window.open('https://www.linkedin.com/search/results/people/', '_blank')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <MessageSquare className="text-blue-600" /> Campaign Setup
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lead Name *</label>
            <input 
              type="text" 
              value={leadName}
              onChange={e => setLeadName(e.target.value)}
              placeholder="e.g. John Doe" 
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn Profile URL (Optional)</label>
            <input 
              type="url" 
              value={leadUrl}
              onChange={e => setLeadUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/..." 
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
            <select 
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="en">English (International)</option>
              <option value="nl">Dutch (NL/BE)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlight a Portfolio Property?</label>
            <select 
              value={selectedPropertyId}
              onChange={e => setSelectedPropertyId(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">-- General Introduction (No specific property) --</option>
              {properties.map(h => (
                <option key={h.id} value={h.id}>{h.name} {h.category === 'investment' ? '(Investment)' : ''}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!leadName}
            className="w-full mt-4 flex justify-center items-center gap-2 bg-primary hover:bg-secondary text-white py-2.5 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} /> Generate Message
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Generated Message</h2>
        
        {generatedMessage ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans shadow-inner">
              {generatedMessage}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleCopy}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md font-medium transition-colors border ${
                  copied 
                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : '1. Copy Message'}
              </button>

              <button 
                onClick={openLinkedIn}
                className="flex-1 flex justify-center items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
              >
                <ExternalLink size={18} /> 
                {leadUrl ? '2. Open Profile' : '2. Open LinkedIn'}
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-4">
              <strong>Safe Workflow:</strong> Copy the text, click "Open Profile", click Connect/Message in LinkedIn, and paste. This guarantees 100% safety from LinkedIn bans.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p>Fill in the details to generate a highly converting message.</p>
          </div>
        )}
      </div>
    </div>
  )
}
