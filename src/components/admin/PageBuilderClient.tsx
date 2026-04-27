'use client'

import { useState } from 'react'
import { updatePageContent } from '@/app/actions/pages'
import CloudinaryUploader from '@/components/admin/CloudinaryUploader'
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Loader2, Image as ImageIcon, Type, Heading } from 'lucide-react'

export default function PageBuilderClient({ 
  initialData, 
  pageSlug, 
  pageTitle 
}: { 
  initialData: any, 
  pageSlug: string, 
  pageTitle: string 
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [heroImage, setHeroImage] = useState(initialData?.hero_image || '')
  const initialHero2 = initialData?.content_blocks?.find((b: any) => b.type === 'hero_image_2')?.content || ''
  const [heroImage2, setHeroImage2] = useState(initialHero2)
  const initialBlocks = initialData?.content_blocks?.filter((b: any) => b.type !== 'hero_image_2') || []
  const [blocks, setBlocks] = useState<any[]>(initialBlocks)
  const [loading, setLoading] = useState(false)

  const handleAddBlock = (type: string) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: '', size: type === 'heading' ? 'text-3xl' : 'text-base' }])
  }

  const handleRemoveBlock = (index: number) => {
    const newBlocks = [...blocks]
    newBlocks.splice(index, 1)
    setBlocks(newBlocks)
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === blocks.length - 1) return
    
    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[direction === 'up' ? index - 1 : index + 1]
    newBlocks[direction === 'up' ? index - 1 : index + 1] = temp
    setBlocks(newBlocks)
  }

  const updateBlock = (index: number, field: string, value: string) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], [field]: value }
    setBlocks(newBlocks)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const filteredBlocks = blocks.filter(b => b.type !== 'hero_image_2')
      if (heroImage2) {
        filteredBlocks.unshift({ id: 'hero_2', type: 'hero_image_2', content: heroImage2, size: 'media' })
      }

      const res = await updatePageContent(pageSlug, {
        title,
        hero_image: heroImage,
        content_blocks: filteredBlocks
      })
      if (res.error) {
        alert('Fout bij opslaan: ' + res.error)
      } else {
        alert('Pagina succesvol opgeslagen!')
      }
    } catch (err: any) {
      console.error(err)
      alert('Fout bij opslaan: ' + (err.message || 'Onbekende fout'))
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary dark:text-white">Pagina Bewerken: {pageTitle}</h1>
          <p className="text-gray-500">Pas teksten, plaatjes en groottes aan voor de {pageTitle.toLowerCase()} pagina.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="flex items-center px-6 py-3 bg-accent text-white font-bold rounded-md hover:bg-primary transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          <span>Opslaan</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <h2 className="text-xl font-bold border-b pb-2">Hero Sectie (Bovenkant)</h2>
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Grote Titel</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Hero Media (Foto / Video) 1</label>
          {heroImage && (
            <div className="w-full h-40 relative rounded-md overflow-hidden mb-4">
              {heroImage.endsWith('.mp4') || heroImage.endsWith('.mov') || heroImage.endsWith('.webm') ? (
                <video src={heroImage} className="w-full h-full object-cover" controls />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={heroImage} alt="Hero 1" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <CloudinaryUploader 
            onUploadSuccess={(url) => setHeroImage(url)} 
            label="Upload Hero Media 1"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Hero Media (Foto / Video) 2</label>
          {heroImage2 && (
            <div className="w-full h-40 relative rounded-md overflow-hidden mb-4">
              {heroImage2.endsWith('.mp4') || heroImage2.endsWith('.mov') || heroImage2.endsWith('.webm') ? (
                <video src={heroImage2} className="w-full h-full object-cover" controls />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={heroImage2} alt="Hero 2" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <CloudinaryUploader 
            onUploadSuccess={(url) => setHeroImage2(url)} 
            label="Upload Hero Media 2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center justify-between">
          <span>Pagina Inhoud (Blokken)</span>
        </h2>

        {blocks.map((block, index) => (
          <div key={block.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative group transition-all hover:border-accent/50">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleMoveBlock(index, 'up')} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><ArrowUp size={16} /></button>
              <button onClick={() => handleMoveBlock(index, 'down')} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><ArrowDown size={16} /></button>
            </div>
            
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-bold text-sm uppercase tracking-wider text-accent flex items-center gap-2">
                {block.type === 'heading' && <><Heading size={16} /> <span>Koptekst</span></>}
                {block.type === 'text' && <><Type size={16} /> <span>Alinea (Lappen tekst)</span></>}
                {block.type === 'quote' && <><Type size={16} /> <span>Grote Quote / Citaat</span></>}
                {block.type === 'bullet-list' && <><Type size={16} /> <span>Opsomming (Bullet points)</span></>}
                {block.type === 'cta' && <><Type size={16} /> <span>Knop (Call to Action)</span></>}
                {block.type === 'divider' && <><Type size={16} /> <span>Scheidingslijn (Divider)</span></>}
                {block.type === 'image' && <><ImageIcon size={16} /> <span>Afbeelding</span></>}
                {block.type === 'image-text' && <><ImageIcon size={16} /> <span>Tekst + Foto Sectie</span></>}
              </span>
              <button onClick={() => handleRemoveBlock(index)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
            </div>

            {block.type === 'heading' && (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={block.content} 
                  onChange={(e) => updateBlock(index, 'content', e.target.value)} 
                  placeholder="Koptekst..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent"
                />
                <select value={block.size} onChange={(e) => updateBlock(index, 'size', e.target.value)} className="p-2 border rounded-md">
                  <option value="text-2xl">Klein (H3)</option>
                  <option value="text-3xl">Middel (H2)</option>
                  <option value="text-5xl">Groot (H1)</option>
                </select>
              </div>
            )}

            {block.type === 'text' && (
              <div className="space-y-3">
                <textarea 
                  rows={5} 
                  value={block.content} 
                  onChange={(e) => updateBlock(index, 'content', e.target.value)} 
                  placeholder="Typ hier de lappen tekst..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent"
                />
                <select value={block.size} onChange={(e) => updateBlock(index, 'size', e.target.value)} className="p-2 border rounded-md">
                  <option value="text-sm">Klein</option>
                  <option value="text-base">Normaal</option>
                  <option value="text-lg">Iets Groter</option>
                  <option value="text-xl">Groot & Opvallend</option>
                </select>
              </div>
            )}

            {block.type === 'quote' && (
              <div className="space-y-3">
                <textarea 
                  rows={3} 
                  value={block.content} 
                  onChange={(e) => updateBlock(index, 'content', e.target.value)} 
                  placeholder="Typ hier de grote, opvallende quote..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent text-xl italic font-serif"
                />
              </div>
            )}

            {block.type === 'bullet-list' && (
              <div className="space-y-3">
                <label className="block text-sm text-gray-500">Zet elk item op een nieuwe regel. Start eventueel met een streepje (-).</label>
                <textarea 
                  rows={6} 
                  value={block.content} 
                  onChange={(e) => updateBlock(index, 'content', e.target.value)} 
                  placeholder="- Waardebehoud door hoge kwaliteit\n- Wereldwijd bereik via ons netwerk\n- Exclusieve events voor investeerders"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent font-mono"
                />
              </div>
            )}

            {block.type === 'cta' && (
              <div className="space-y-3 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">Knop Tekst</label>
                  <input 
                    type="text" 
                    value={block.content} 
                    onChange={(e) => updateBlock(index, 'content', e.target.value)} 
                    placeholder="Bv: Request Investment Deck"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">Link URL</label>
                  <input 
                    type="text" 
                    value={block.image_url || ''} 
                    onChange={(e) => updateBlock(index, 'image_url', e.target.value)} 
                    placeholder="Bv: /contact of /investors/portfolio"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            {block.type === 'divider' && (
              <div className="py-4 text-center text-gray-400">
                --- Scheidingslijn (Zichtbaar op de website) ---
              </div>
            )}

            {block.type === 'image' && (
              <div className="space-y-3">
                {block.content ? (
                  <div className="w-full relative rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.content} alt="Block" className="w-full h-auto object-contain" />
                  </div>
                ) : (
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                    Nog geen afbeelding geselecteerd
                  </div>
                )}
                <CloudinaryUploader 
                  onUploadSuccess={(url) => updateBlock(index, 'content', url)} 
                  label="Upload Afbeelding"
                />
              </div>
            )}
            {block.type === 'image-text' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Tekst (links/rechts)</label>
                    <textarea 
                      rows={6} 
                      value={block.content} 
                      onChange={(e) => updateBlock(index, 'content', e.target.value)} 
                      placeholder="Typ hier de tekst voor dit gedeelte..."
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-accent"
                    />
                    <div className="flex gap-2 items-center">
                      <label className="text-sm">Afbeelding positie:</label>
                      <select value={block.size || 'image-right'} onChange={(e) => updateBlock(index, 'size', e.target.value)} className="p-1 border rounded-md text-sm">
                        <option value="image-left">Afbeelding Links, Tekst Rechts</option>
                        <option value="image-right">Tekst Links, Afbeelding Rechts</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="w-1/3 space-y-3 border-l pl-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Afbeelding</label>
                    {block.image_url ? (
                      <div className="w-full relative rounded-md overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={block.image_url} alt="Block" className="w-full h-auto object-contain" />
                      </div>
                    ) : (
                      <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-xs text-center p-2">
                        Geen afbeelding
                      </div>
                    )}
                    <CloudinaryUploader 
                      onUploadSuccess={(url) => updateBlock(index, 'image_url', url)} 
                      label="Upload Foto"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && <div className="text-center p-10 text-gray-500">Nog geen blokken toegevoegd.</div>}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button onClick={() => handleAddBlock('heading')} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            <Heading size={16} className="mr-2" /> Koptekst
          </button>
          <button onClick={() => handleAddBlock('text')} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            <Type size={16} className="mr-2" /> Tekst
          </button>
          <button onClick={() => handleAddBlock('bullet-list')} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            <Type size={16} className="mr-2" /> Opsomming (Bullets)
          </button>
          <button onClick={() => handleAddBlock('quote')} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            <Type size={16} className="mr-2" /> Grote Quote
          </button>
          <button onClick={() => {
            setBlocks([...blocks, { id: Date.now().toString(), type: 'cta', content: 'Lees meer', image_url: '/' }])
          }} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            <ArrowUp size={16} className="mr-2" /> Knop / Link
          </button>
          <button onClick={() => handleAddBlock('divider')} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            --- Scheidingslijn
          </button>
          <button onClick={() => handleAddBlock('image')} className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm">
            <ImageIcon size={16} className="mr-2" /> Losse Foto
          </button>
          <button onClick={() => {
            setBlocks([...blocks, { id: Date.now().toString(), type: 'image-text', content: '', image_url: '', size: 'image-right' }])
          }} className="flex items-center px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-md font-medium text-sm border border-accent/20">
            <ImageIcon size={16} className="mr-2" /> Sectie (Tekst + Foto)
          </button>
        </div>
      </div>
      {pageSlug === 'investors' && (
        <p className="text-center text-sm text-gray-500">Let op: De ROI Calculator staat standaard vast onderaan de "Want to invest" pagina.</p>
      )}
    </div>
  )
}
