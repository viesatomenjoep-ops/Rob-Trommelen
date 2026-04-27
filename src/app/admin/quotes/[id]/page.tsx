'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getQuoteWithItems, sendQuoteEmail } from '@/app/actions/quotes'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Printer, Send, Mail, Edit } from 'lucide-react'

export default function QuoteDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<{ quote: any, items: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailPass, setEmailPass] = useState('')
  const [sending, setSending] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  useEffect(() => {
    async function fetchQuote() {
      if (id) {
        const res = await getQuoteWithItems(id as string)
        setData(res)
      }
      setLoading(false)
    }
    fetchQuote()
  }, [id])

  if (loading) return <div className="p-10 text-center">Laden...</div>
  if (!data || !data.quote) return <div className="p-10 text-center text-red-500">Offerte niet gevonden.</div>

  const { quote, items } = data

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = async () => {
    if (!emailPass || emailPass.length < 16) {
      alert("Voer een geldig 16-letterig Google App-wachtwoord in (zonder spaties).")
      return
    }

    setSending(true)
    try {
      // Remove spaces if user copy pasted with spaces
      const cleanPass = emailPass.replace(/\s+/g, '')
      await sendQuoteEmail(quote.id, cleanPass)
      alert("Offerte is succesvol verzonden!")
      setShowEmailDialog(false)

      // Update local state to show 'sent'
      setData({ ...data, quote: { ...quote, status: 'sent' } })
    } catch (error: any) {
      console.error(error)
      alert("Fout bij verzenden: " + error.message)
    }
    setSending(false)
  }

  const [docLang, setDocLang] = useState('EN')

  const t = {
    EN: {
      order: 'ORDER', quote: 'QUOTE', number: 'Number:', date: 'Date:', valid: 'Valid until:',
      from: 'From', to: 'To', desc: 'Description', qty: 'Qty', price: 'Unit Price', total: 'Total',
      subtotal: 'Subtotal', tax: 'VAT', notes: 'Notes',
      paymentInfo: 'Payment Instructions', bank: 'Bank Transfer', iban: 'IBAN:', bic: 'BIC / SWIFT:', accountName: 'Account Name:', reference: 'Payment Reference:', signature: 'Authorized Signature', terms: 'Payment is due within 14 days. Please include the payment reference with your transfer.'
    },
    NL: {
      order: 'ORDER', quote: 'OFFERTE', number: 'Nummer:', date: 'Datum:', valid: 'Geldig tot:',
      from: 'Van', to: 'Aan', desc: 'Omschrijving', qty: 'Aantal', price: 'Stukprijs', total: 'Totaal',
      subtotal: 'Subtotaal', tax: 'BTW', notes: 'Opmerkingen',
      paymentInfo: 'Betaalinstructies', bank: 'Bankoverschrijving', iban: 'IBAN:', bic: 'BIC / SWIFT:', accountName: 'Tenaamstelling:', reference: 'Betalingskenmerk:', signature: 'Geautoriseerde Handtekening', terms: 'Betaling dient te geschieden binnen 14 dagen. Vermeld a.u.b. het betalingskenmerk bij uw overboeking.'
    },
    DE: {
      order: 'BESTELLUNG', quote: 'ANGEBOT', number: 'Nummer:', date: 'Datum:', valid: 'Gültig bis:',
      from: 'Von', to: 'An', desc: 'Beschreibung', qty: 'Menge', price: 'Einzelpreis', total: 'Gesamt',
      subtotal: 'Zwischensumme', tax: 'MwSt.', notes: 'Anmerkungen',
      paymentInfo: 'Zahlungshinweise', bank: 'Banküberweisung', iban: 'IBAN:', bic: 'BIC / SWIFT:', accountName: 'Kontoinhaber:', reference: 'Verwendungszweck:', signature: 'Autorisierte Unterschrift', terms: 'Die Zahlung ist innerhalb von 14 Tagen fällig. Bitte geben Sie den Verwendungszweck bei Ihrer Überweisung an.'
    },
    ES: {
      order: 'PEDIDO', quote: 'PRESUPUESTO', number: 'Número:', date: 'Fecha:', valid: 'Válido hasta:',
      from: 'De', to: 'Para', desc: 'Descripción', qty: 'Cant', price: 'Precio unitario', total: 'Total',
      subtotal: 'Subtotal', tax: 'IVA', notes: 'Notas',
      paymentInfo: 'Instrucciones de Pago', bank: 'Transferencia Bancaria', iban: 'IBAN:', bic: 'BIC / SWIFT:', accountName: 'Titular:', reference: 'Referencia:', signature: 'Firma Autorizada', terms: 'El pago debe realizarse en un plazo de 14 días. Por favor, incluya la referencia en su transferencia.'
    }
  } as any

  const l = t[docLang]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 print:p-0 print:max-w-none">

      {/* Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link href="/admin/quotes" className="flex items-center text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to overview
        </Link>
        <div className="flex gap-3 flex-wrap items-center">
          <select 
            value={docLang} 
            onChange={(e) => setDocLang(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-sm font-bold bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="EN">🇺🇸 English</option>
            <option value="NL">🇳🇱 Dutch</option>
            <option value="DE">🇩🇪 German</option>
            <option value="ES">🇪🇸 Spanish</option>
          </select>
          <Link href={`/admin/quotes/${quote.id}/edit`} className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
            <Edit size={18} className="mr-2" /> Edit
          </Link>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Printer size={18} className="mr-2" /> Print / PDF
          </button>
          <button onClick={() => setShowEmailDialog(true)} className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-primary transition-colors">
            <Send size={18} className="mr-2" /> Email Client
          </button>
        </div>
      </div>

      {/* Email Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Mail className="mr-2" /> Send Email
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This document will be sent to <strong>{quote.client_email}</strong> from your email (tomjo118735@gmail.com).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google App Password</label>
              <input
                type="password"
                placeholder="abcd efgh ijkl mnop"
                value={emailPass}
                onChange={(e) => setEmailPass(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-accent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Paste your 16-letter code from your Google Account.</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowEmailDialog(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button onClick={handleSendEmail} disabled={sending} className="px-4 py-2 bg-accent text-white rounded-md disabled:opacity-50">
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Document - LUXURY DESIGN */}
      <div className="bg-white relative rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Luxury Top Border */}
        <div className="h-4 bg-gradient-to-r from-primary via-accent to-primary"></div>
        
        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Image src="/logo.png" alt="Equivest Watermark" width={800} height={800} className="w-[150%] max-w-none grayscale" />
        </div>

        <div className="p-12 sm:p-20 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                <Image src="/logo.png" alt="Equivest" width={60} height={60} className="object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-primary tracking-tight">EQUIVEST</h1>
                <p className="text-sm tracking-[0.2em] text-accent uppercase font-medium mt-1">Portfolio Management</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600 space-y-2">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 uppercase tracking-wider">
                {quote.type === 'order' ? l.order : l.quote}
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-right">
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-xs">{l.number}</span>
                <span className="font-medium text-gray-900">{quote.quote_number}</span>
                
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-xs">{l.date}</span>
                <span className="font-medium text-gray-900">{new Date(quote.date).toLocaleDateString()}</span>
                
                {quote.valid_until && (
                  <>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider text-xs">{l.valid}</span>
                    <span className="font-medium text-gray-900">{new Date(quote.valid_until).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="flex justify-between mt-12">
            <div className="w-1/2 pr-8">
              <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-4">{l.from}</h3>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p className="font-bold text-gray-900 text-base">Equivest Portfolio Management B.V.</p>
                <p>Oude Gracht 123</p>
                <p>1011 AB Amsterdam</p>
                <p>The Netherlands</p>
                <p className="pt-2 text-accent">tomjo118735@gmail.com</p>
              </div>
            </div>
            <div className="w-1/2 pl-8 border-l border-gray-100">
              <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-4">{l.to}</h3>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p className="font-bold text-gray-900 text-lg">{quote.client_name}</p>
                {quote.client_company && <p className="font-medium">{quote.client_company}</p>}
                {quote.client_address && <p>{quote.client_address}</p>}
                <p className="pt-2">{quote.client_email}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-16">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50/50">
                  <th className="py-4 px-4 font-bold text-gray-900 uppercase tracking-wider text-xs">{l.desc}</th>
                  <th className="py-4 px-4 font-bold text-gray-900 uppercase tracking-wider text-xs text-center w-24">{l.qty}</th>
                  <th className="py-4 px-4 font-bold text-gray-900 uppercase tracking-wider text-xs text-right w-32">{l.price}</th>
                  <th className="py-4 px-4 font-bold text-gray-900 uppercase tracking-wider text-xs text-right w-32">{l.total}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {items.map((item: any, i: number) => (
                  <tr key={i} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="py-5 px-4 font-medium">{item.description}</td>
                    <td className="py-5 px-4 text-center">{item.quantity}</td>
                    <td className="py-5 px-4 text-right">€ {Number(item.unit_price).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                    <td className="py-5 px-4 text-right font-medium text-gray-900">€ {Number(item.total).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Container */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-12">
            
            {/* Notes & Payment Instructions */}
            <div className="w-full md:w-3/5 space-y-8">
              {quote.notes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-xs">{l.notes}</h4>
                  <p className="whitespace-pre-wrap leading-relaxed">{quote.notes}</p>
                </div>
              )}
              
              {quote.type === 'order' && (
                <div className="text-sm text-gray-600 p-6 rounded-xl border border-primary/10 bg-primary/5">
                  <h4 className="font-bold text-primary mb-4 uppercase tracking-wider text-xs">{l.paymentInfo}</h4>
                  <div className="space-y-2 mb-4">
                    <p><span className="font-semibold text-gray-900 w-32 inline-block">{l.bank}</span> WISE Institutional</p>
                    <p><span className="font-semibold text-gray-900 w-32 inline-block">{l.accountName}</span> Equivest Portfolio Management B.V.</p>
                    <p><span className="font-semibold text-gray-900 w-32 inline-block">{l.iban}</span> NL99 WISE 0123 4567 89</p>
                    <p><span className="font-semibold text-gray-900 w-32 inline-block">{l.bic}</span> WISEXXXX</p>
                    <p className="pt-2"><span className="font-semibold text-accent w-32 inline-block">{l.reference}</span> <span className="font-bold text-gray-900 bg-white px-2 py-1 border border-gray-200 rounded">{quote.quote_number}</span></p>
                  </div>
                  <p className="text-xs text-gray-500 italic border-t border-gray-200/50 pt-3">{l.terms}</p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="w-full md:w-2/5">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">{l.subtotal}</span>
                    <span className="font-medium">€ {Number(quote.subtotal).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">{l.tax} ({quote.tax_rate}%)</span>
                    <span className="font-medium">€ {Number(quote.tax_amount).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary border-t border-gray-200 pt-4 mt-2">
                    <span>{l.total}</span>
                    <span>€ {Number(quote.total_amount).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-16 text-center border-t border-gray-200 pt-8">
                <p className="font-[Signature] text-5xl text-primary opacity-80 mb-2 transform -rotate-2">Tom van Biene</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{l.signature}</p>
                <p className="text-xs text-gray-500 mt-1">Equivest Portfolio Management</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 pt-6 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
            <p>Equivest Worldwide — Premium Sport Properties Since 1995</p>
            <p>kvk: 12345678 • btw: NL87654321B01</p>
          </div>

        </div>
      </div>
    </div>
  )
}
