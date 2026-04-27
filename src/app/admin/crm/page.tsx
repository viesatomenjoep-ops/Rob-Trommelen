import { getClientCRMInsights } from '@/app/actions/crm'
import { Flame, Mail, Calendar, DollarSign, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CRMPage() {
  const clients = await getClientCRMInsights()

  const hotLeads = clients.filter((c: any) => c.isHotLead)
  const existingClients = clients.filter((c: any) => !c.isHotLead && c.totalSpent > 0)
  const coldLeads = clients.filter((c: any) => !c.isHotLead && c.totalSpent === 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Klanten CRM & AI Leads</h1>
          <p className="text-gray-500 mt-1">Automatisch gegenereerde profielen gebaseerd op afspraken en orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hot Leads Kolom */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hot Leads ({hotLeads.length})</h2>
          </div>
          {hotLeads.map((client: any, idx: number) => (
            <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{client.name}</h3>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1">
                  <Flame size={12} /> HOT
                </span>
              </div>
              <a href={`mailto:${client.email}`} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1 hover:text-primary">
                <Mail size={14} /> {client.email}
              </a>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm border-t border-orange-200/50 dark:border-orange-800/50 pt-3">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Afspraken</span>
                  <span className="font-medium flex items-center gap-1"><Calendar size={14}/> {client.appointmentCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Offertes</span>
                  <span className="font-medium flex items-center gap-1"><Activity size={14}/> {client.quoteCount}</span>
                </div>
              </div>
              {client.history.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  <span className="font-bold">Laatste actie:</span> {client.history[0].type} ({new Date(client.history[0].date).toLocaleDateString()})
                </div>
              )}
            </div>
          ))}
          {hotLeads.length === 0 && <p className="text-gray-500 text-sm">Geen hot leads op dit moment.</p>}
        </div>

        {/* Bestaande Klanten Kolom */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bestaande Klanten ({existingClients.length})</h2>
          </div>
          {existingClients.map((client: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{client.name}</h3>
              <a href={`mailto:${client.email}`} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1 hover:text-primary">
                <Mail size={14} /> {client.email}
              </a>
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800 flex justify-between items-center">
                <span className="text-xs text-green-700 dark:text-green-400 uppercase font-bold">Totaal Besteed</span>
                <span className="font-bold text-green-700 dark:text-green-400">€ {client.totalSpent.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {existingClients.length === 0 && <p className="text-gray-500 text-sm">Nog geen betalende klanten.</p>}
        </div>

        {/* Cold Leads Kolom */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Overig / Inactief ({coldLeads.length})</h2>
          </div>
          {coldLeads.map((client: any, idx: number) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-5 rounded-xl shadow-sm opacity-75">
              <h3 className="font-bold text-gray-900 dark:text-white">{client.name}</h3>
              <a href={`mailto:${client.email}`} className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Mail size={14} /> {client.email}
              </a>
            </div>
          ))}
          {coldLeads.length === 0 && <p className="text-gray-500 text-sm">Geen inactieve profielen.</p>}
        </div>

      </div>
    </div>
  )
}
