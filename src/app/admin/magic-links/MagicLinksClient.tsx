'use client'

import { useState } from 'react'
import { Clock, EyeOff, FileSignature, Share2, Search, CheckCircle, Copy, ShieldCheck, MessageCircle, Languages, Calculator, GitCompare, Lock, BarChart3, PieChart, CreditCard, PenTool, UploadCloud, Calendar as CalendarIcon, Mail, Plane, Stethoscope, Stamp, Timer, Video, Sparkles } from 'lucide-react'

const Card = ({ icon: Icon, title, desc, children, colorClass }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 rounded-lg ${colorClass}`}><Icon size={24} /></div>
      <h3 className="font-bold text-lg dark:text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">{desc}</p>
    <div>{children}</div>
  </div>
)

export default function MagicLinksClient({ properties }: { properties: any[] }) {
  const [activeTab, setActiveTab] = useState<'sales' | 'finance' | 'ops' | 'internal'>('sales')
  
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [selectedPropertiesForCompare, setSelectedPropertiesForCompare] = useState<string[]>([])
  const [clientName, setClientName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [socialPropertyId, setSocialPropertyId] = useState('')
  const [socialText, setSocialText] = useState('')
  const [whatsappLanguage, setWhatsappLanguage] = useState('EN')
  const [aiQuery, setAiQuery] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState('EUR')

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getBaseUrl = () => typeof window !== 'undefined' ? window.location.origin : 'https://www.equivestworldwide.com'

  const generateLink = (path: string) => {
    if (!selectedPropertyId) return alert('Select a property first')
    const token = Math.random().toString(36).substring(2, 15)
    setGeneratedLink(`${getBaseUrl()}${path.replace('[id]', selectedPropertyId).replace('[token]', token)}`)
  }

  const generateCompareLink = () => {
    if (selectedPropertiesForCompare.length < 2) return alert('Select at least 2 properties')
    setGeneratedLink(`${getBaseUrl()}/compare/${selectedPropertiesForCompare.join(',')}`)
  }

  const handleCompareSelect = (id: string) => {
    if (selectedPropertiesForCompare.includes(id)) setSelectedPropertiesForCompare(prev => prev.filter(h => h !== id))
    else if (selectedPropertiesForCompare.length < 3) setSelectedPropertiesForCompare(prev => [...prev, id])
  }

  const generateProposalLink = () => {
    if (!clientName || !selectedPropertyId) return alert('Enter client name and select a property')
    const slug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    setGeneratedLink(`${getBaseUrl()}/proposal/${slug}?properties=${selectedPropertyId}`)
  }

  const generateNewsletter = () => {
    if (selectedPropertiesForCompare.length === 0) return alert('Select at least 1 property from the Compare list above first')
    setSocialText(`<h1>Equivest Portfolio Update</h1>\n<p>Discover our newest premium assets.</p>\n\n` + selectedPropertiesForCompare.map(id => {
      const h = properties.find(x => x.id === id)
      return `<h3>${h?.name}</h3><p>Level: ${h?.experience_level}</p><a href="https://www.equivestworldwide.com/properties/${h?.id}">View Investment</a><br/><br/>`
    }).join(''))
  }

  const generateWhatsappPitch = () => {
    if (!socialPropertyId) return alert('Select a property first')
    const h = properties.find(x => x.id === socialPropertyId)
    if (!h) return
    const text = whatsappLanguage === 'NL' 
      ? `Hoi! Ik wilde je dit paard even laten zien: *${h.name}*\n\n🔹 *Niveau:* ${h.experience_level}\n🔹 *Prijs:* ${h.price_category}\n\nBekijk de video direct via:\nhttps://www.equivestworldwide.com/vip/${h.id}?token=preview\n\nLaat me weten wat je ervan vindt!`
      : `Hi! Take a look at this exceptional asset: *${h.name}*\n\n🔹 *Level:* ${h.experience_level}\n🔹 *Price:* ${h.price_category}\n\nView the video directly via:\nhttps://www.equivestworldwide.com/vip/${h.id}?token=preview\n\nLet me know your thoughts!`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleAiMatch = () => {
    if (!aiQuery) return alert('Enter a search prompt first')
    // Dummy AI Match logic: select first 2 properties
    if (properties.length >= 2) {
      setGeneratedLink(`${getBaseUrl()}/compare/${properties[0].id},${properties[1].id}`)
    } else {
      alert('Not enough properties in DB')
    }
  }

  // Helper to render the select dropdown without unmounting
  const renderPropertySelector = () => (
    <select className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-3" value={selectedPropertyId} onChange={(e) => setSelectedPropertyId(e.target.value)}>
      <option value="">Select a property...</option>
      {properties.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
    </select>
  )

  // Card component was moved outside to prevent unmounting/losing focus

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { id: 'sales', label: 'Sales & Pitching' },
          { id: 'finance', label: 'Finance & Legal' },
          { id: 'ops', label: 'Logistics & Ops' },
          { id: 'internal', label: 'Internal Automation' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-2 px-4 rounded-full font-bold text-sm transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'sales' && (
          <>
            <Card icon={Clock} title="24H VIP Access" desc="Bypass the login wall for exactly 24 hours. Perfect for quick investor previews." colorClass="bg-purple-100 text-purple-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/vip/[id]?token=[token]')} className="w-full py-2 bg-purple-600 text-white rounded-md font-bold text-sm">Generate VIP Link</button>
            </Card>
            <Card icon={EyeOff} title="Blind Link" desc="White-label link for agents. Hides name, pedigree, and branding." colorClass="bg-gray-100 text-gray-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/blind-portfolio/[id]')} className="w-full py-2 bg-gray-800 text-white rounded-md font-bold text-sm">Generate Blind Link</button>
            </Card>
            <Card icon={FileSignature} title="Custom Proposal" desc="Create a personalized pitch page dedicated to a specific client." colorClass="bg-blue-100 text-blue-600">
              <input type="text" placeholder="Client Name" className="w-full text-sm rounded-md border-gray-300 mb-3" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              {renderPropertySelector()}
              <button onClick={generateProposalLink} className="w-full py-2 bg-blue-600 text-white rounded-md font-bold text-sm">Generate Proposal</button>
            </Card>
            <Card icon={Timer} title="Flash Sale (Off-Market)" desc="Generates a 48H self-destructing page with a special price to create FOMO." colorClass="bg-red-100 text-red-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/flash-sale/[id]')} className="w-full py-2 bg-red-600 text-white rounded-md font-bold text-sm animate-pulse">Generate Flash Sale Link</button>
            </Card>
            <Card icon={GitCompare} title="Side-by-Side Matchmaker" desc="Select 2-3 properties for a side-by-side comparison page." colorClass="bg-orange-100 text-orange-600">
              <div className="h-24 overflow-y-auto border border-gray-200 rounded-md p-2 mb-3">
                {properties.map(h => (
                  <label key={h.id} className="flex items-center gap-2 text-sm mb-1 cursor-pointer"><input type="checkbox" checked={selectedPropertiesForCompare.includes(h.id)} onChange={() => handleCompareSelect(h.id)} />{h.name}</label>
                ))}
              </div>
              <button onClick={generateCompareLink} className="w-full py-2 bg-orange-500 text-white rounded-md font-bold text-sm">Generate Comparison</button>
            </Card>
            <Card icon={Calculator} title="ROI Calculator" desc="Interactive calculator showing projected returns for a specific property." colorClass="bg-emerald-100 text-emerald-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/roi-calculator/[id]')} className="w-full py-2 bg-emerald-600 text-white rounded-md font-bold text-sm">Generate ROI Link</button>
            </Card>
            <Card icon={BarChart3} title="Investor Analytics" desc="Private dashboard for current owners to view live traffic & interest." colorClass="bg-teal-100 text-teal-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/analytics/[id]?token=[token]')} className="w-full py-2 bg-teal-600 text-white rounded-md font-bold text-sm">Generate Stats Link</button>
            </Card>
            <Card icon={Video} title="Training Portal" desc="After-sales link where owners can see training progress and videos." colorClass="bg-indigo-100 text-indigo-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/training-portal/[id]')} className="w-full py-2 bg-indigo-600 text-white rounded-md font-bold text-sm">Generate Portal Link</button>
            </Card>
          </>
        )}

        {activeTab === 'finance' && (
          <>
            <Card icon={PieChart} title="Syndicate Offering" desc="Fractional ownership page to raise capital from multiple investors." colorClass="bg-indigo-100 text-indigo-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/syndicate/[id]')} className="w-full py-2 bg-indigo-600 text-white rounded-md font-bold text-sm">Generate Syndicate Link</button>
            </Card>
            <Card icon={CreditCard} title="WISE Payment Link" desc="Generate an international wire transfer instruction via WISE for deposits." colorClass="bg-[#9fe870] text-[#163300]">
              {renderPropertySelector()}
              <div className="flex gap-2 mb-3">
                <select className="w-1/3 text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={paymentCurrency} onChange={(e) => setPaymentCurrency(e.target.value)}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
                <input type="number" placeholder="Amount (e.g. 5000)" className="w-2/3 text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
              </div>
              <button onClick={() => {
                if (!selectedPropertyId) return alert('Select a property first')
                if (!paymentAmount) return alert('Enter an amount')
                const token = Math.random().toString(36).substring(2, 15)
                setGeneratedLink(`https://www.equivestworldwide.com/pay/${token}?property=${selectedPropertyId}&amount=${paymentAmount}&currency=${paymentCurrency}`)
              }} className="w-full py-2 bg-[#163300] text-[#9fe870] rounded-md font-bold text-sm">Generate WISE Link</button>
            </Card>
            <Card icon={PenTool} title="Digital E-Sign Contract" desc="Send the Equivest Bill of Sale for digital smartphone signature." colorClass="bg-rose-100 text-rose-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/sign/[id]')} className="w-full py-2 bg-rose-600 text-white rounded-md font-bold text-sm">Generate E-Sign Link</button>
            </Card>
            <Card icon={Stamp} title="Valuation Certificate" desc="Formal web-certificate of valuation and health for insurance agents." colorClass="bg-yellow-100 text-yellow-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/certificate/[id]')} className="w-full py-2 bg-yellow-500 text-white rounded-md font-bold text-sm">Generate Certificate</button>
            </Card>
          </>
        )}

        {activeTab === 'ops' && (
          <>
            <Card icon={UploadCloud} title="Secure Document Drop" desc="Send a link to vets/owners to securely upload heavy 4K videos or X-Rays." colorClass="bg-cyan-100 text-cyan-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/drop/[id]')} className="w-full py-2 bg-cyan-600 text-white rounded-md font-bold text-sm">Generate Drop Link</button>
            </Card>
            <Card icon={CalendarIcon} title="Live Try-Out Booking" desc="Let clients book a viewing/try-out session directly in your calendar." colorClass="bg-amber-100 text-amber-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/book-visit/[id]')} className="w-full py-2 bg-amber-500 text-white rounded-md font-bold text-sm">Generate Booking Link</button>
            </Card>
            <Card icon={Lock} title="Reserve & PPE Request" desc="Allow clients to digitally reserve a property for 48H and request a Vet Check." colorClass="bg-red-100 text-red-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/reserve/[id]')} className="w-full py-2 bg-red-600 text-white rounded-md font-bold text-sm">Generate Reserve Link</button>
            </Card>
            <Card icon={Plane} title="Global Transport Calculator" desc="Let international clients estimate shipping/quarantine costs instantly." colorClass="bg-slate-100 text-slate-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/transport/[id]')} className="w-full py-2 bg-slate-600 text-white rounded-md font-bold text-sm">Generate Transport Link</button>
            </Card>
            <Card icon={Stethoscope} title="Virtual Vet Opinion" desc="Strictly medical link where US vets can view X-Rays and upload findings." colorClass="bg-emerald-100 text-emerald-600">
              {renderPropertySelector()}
              <button onClick={() => generateLink('/vet-opinion/[id]')} className="w-full py-2 bg-emerald-600 text-white rounded-md font-bold text-sm">Generate Vet Link</button>
            </Card>
          </>
        )}

        {activeTab === 'internal' && (
          <>
            <Card icon={MessageCircle} title="1-Click WhatsApp Pitch" desc="Generates a perfectly formatted WhatsApp message with stats and a VIP link." colorClass="bg-green-100 text-green-600">
              <select className="w-full text-sm rounded-md border-gray-300 mb-3" value={socialPropertyId} onChange={(e) => setSocialPropertyId(e.target.value)}>
                <option value="">Select a property...</option>
                {properties.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setWhatsappLanguage('EN')} className={`flex-1 py-1 text-sm font-bold rounded ${whatsappLanguage === 'EN' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>EN</button>
                <button onClick={() => setWhatsappLanguage('NL')} className={`flex-1 py-1 text-sm font-bold rounded ${whatsappLanguage === 'NL' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>NL</button>
              </div>
              <button onClick={generateWhatsappPitch} className="w-full py-2 bg-[#25D366] text-white rounded-md font-bold text-sm flex justify-center items-center gap-2"><MessageCircle size={18} /> Open in WhatsApp</button>
            </Card>
            <Card icon={Sparkles} title="AI Matchmaker (Database Scan)" desc="Type what the client wants, AI scans the database and makes a custom link." colorClass="bg-fuchsia-100 text-fuchsia-600">
              <textarea placeholder="e.g. Find me a Chacco-Blue mare for around 100k..." rows={2} className="w-full text-sm rounded-md border-gray-300 mb-3" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} />
              <button onClick={handleAiMatch} className="w-full py-2 bg-fuchsia-600 text-white rounded-md font-bold text-sm flex justify-center items-center gap-2"><Sparkles size={16} /> Run AI Scan</button>
            </Card>
            <Card icon={Mail} title="1-Click Newsletter Builder" desc="Select properties in the Matchmaker tool first, then generate HTML for Mailchimp." colorClass="bg-yellow-100 text-yellow-600">
              <button onClick={generateNewsletter} className="w-full py-2 bg-yellow-500 text-white rounded-md font-bold text-sm mb-3">Generate HTML Newsletter</button>
              {socialText && (
                <div className="mt-2">
                  <textarea readOnly value={socialText} rows={4} className="w-full text-xs p-2 rounded border" />
                  <button onClick={() => handleCopy(socialText)} className="mt-2 w-full py-2 bg-gray-100 text-gray-800 rounded-md font-bold text-sm">Copy Code</button>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {generatedLink && (
        <div className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-primary/20 max-w-md animate-fade-in z-50">
          <div className="flex items-center gap-2 text-green-600 mb-2 font-bold"><ShieldCheck size={20} /> Link Generated!</div>
          <p className="text-xs text-gray-500 mb-3">Send this exact link to your client/agent.</p>
          <input type="text" readOnly value={generatedLink} className="w-full text-xs p-2 rounded bg-gray-50 border border-gray-200 mb-4" />
          <div className="flex gap-2">
            <button onClick={() => handleCopy(generatedLink)} className="flex-1 py-2 bg-primary text-white rounded text-sm font-bold flex items-center justify-center gap-2">
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={() => setGeneratedLink('')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
