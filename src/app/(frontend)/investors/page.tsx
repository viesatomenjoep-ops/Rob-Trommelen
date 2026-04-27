import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { getPageContent } from '@/app/actions/pages'
import RoiCalculatorTabs from '@/components/roi/RoiCalculatorTabs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Invest in Showjumpers | Equivest Worldwide',
  description: 'Discover the lucrative opportunity of investing in premium showjumpers from Europe (NL, BE, GER) for the US market.',
}

export default async function InvestorsPage() {
  let pageData = await getPageContent('investors')

  // Default hardcoded layout if database is empty/not setup
  if (!pageData) {
    pageData = {
      title: 'Invest in Excellence',
      hero_image: '/about-bg.jpg',
      content_blocks: [
        {"id": "1", "type": "heading", "content": "Why Invest in Sportproperties?", "size": "text-4xl"},
        {"id": "2", "type": "text", "content": "The equestrian sport has transitioned from a passion-driven pursuit into a highly professional, multi-billion-dollar global industry. At the pinnacle of this industry sits the showjumping market, where demand for top-tier equine athletes consistently outpaces supply.", "size": "text-lg"},
        {"id": "3", "type": "text", "content": "By partnering with Equivest, you gain direct access to our extensive network in the heart of the equestrian world: the Netherlands, Belgium, and Germany. We meticulously select, train, and export exceptional properties to the United States, where the market commands significant premiums.", "size": "text-lg"},
        {"id": "4", "type": "heading", "content": "The Future of Exclusive Capital", "size": "text-3xl"},
        {"id": "5", "type": "text", "content": "In an era dominated by volatile digital markets, algorithmic trading, and unpredictable stock prices, the modern investor seeks robust diversification. Within the portfolios of the world's most successful investors, a clear trend is emerging: the shift towards tangible, rare, and performance-driven alternative assets. At the absolute intersection of passion, prestige, and exponential returns lies the top sport of showjumping. Investing in elite sportproperties today is no longer an opaque gamble, but a highly strategic and data-driven wealth management decision.", "size": "text-lg"},
        {"id": "6", "type": "heading", "content": "An Uncorrelated Asset Class", "size": "text-2xl"},
        {"id": "7", "type": "text", "content": "The biggest advantage of top sportproperties as an investment is that their value is completely uncorrelated to traditional financial markets. When stocks fall or inflation rises, the intrinsic value of a Grand Prix sportproperty remains exceptionally stable. International top sport is a multi-billion dollar industry driven by Ultra-High-Net-Worth Individuals (UHNWIs), royal families, and global syndicates. The demand for top sport properties capable of performing at the 1.60m level consistently outstrips supply. This creates a scarcity economy where prices for proven talents reach record highs year after year.", "size": "text-lg"},
        {"id": "8", "type": "heading", "content": "From Promise to Blue-Chip: Exponential Value Appreciation", "size": "text-2xl"},
        {"id": "9", "type": "text", "content": "The financial lifecycle of a sportproperty offers unique opportunities for incredible ROI (Return on Investment). The strategy is akin to venture capital: we identify young, raw talent with unprecedented potential. By pairing them with world-class riders and state-of-the-art training programs, we transform these promises into proven top athletes. A 5-year-old talent can, once it proves itself on international stages as a 9- or 10-year-old, multiply its value sixfold. In addition to their trading value, top athletes generate direct returns through explosively rising prize money on circuits like the Global Champions Tour, and through exclusive breeding rights (genetics and embryo trading) that create a lasting income stream.", "size": "text-lg"},
        {"id": "10", "type": "heading", "content": "Investment Rooted in Data and Science", "size": "text-2xl"},
        {"id": "11", "type": "text", "content": "Where property trading used to revolve around 'gut feeling', in 2026 it has become an exact science. Our selection procedure eliminates risks by utilizing advanced biometric analyses, predictive genetic models, and detailed veterinary AI scans. We invest exclusively in athletes whose data demonstrates they possess the perfect balance of physical power, reflexes, health, and the mental perseverance required for the absolute world top. You are not investing in an animal; you are investing in a carefully calibrated top sports machine.", "size": "text-lg"},
        {"id": "12", "type": "heading", "content": "Prestige, Network, and the Ultimate Lifestyle", "size": "text-2xl"},
        {"id": "13", "type": "text", "content": "Finally, owning an elite sportproperty offers a dividend that cannot be captured in any graph: exclusive access. As an investor, you buy into one of the most closed and prestigious ecosystems in the world. You gain VIP access to glamorous events from Monaco to Miami and from Paris to Doha. Ownership provides an unparalleled platform for high-level networking, where you stand shoulder-to-shoulder with influential leaders, CEOs, and other top investors in the VIP stands.", "size": "text-lg"},
        {"id": "14", "type": "heading", "content": "Return on Investment (ROI)", "size": "text-4xl"},
        {"id": "15", "type": "text", "content": "Investing in sportproperties is classified as an alternative asset class. While it carries inherent risks, the potential returns significantly outpace traditional markets when managed by experts. It is the perfect synergy between calculated financial return and an extraordinary lifestyle. It is capital that breathes, performs, and wins.", "size": "text-lg"}
      ]
    }
  }

  const { title, hero_image, content_blocks } = pageData

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-6 pb-20">
      
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="text-accent uppercase tracking-[0.3em] font-bold text-sm mb-2 block">Exclusive Opportunity</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary dark:text-white mb-8 leading-tight">
            {title}
          </h1>
          
          <div className="mb-4">
            <a 
              href="mailto:invest@equivestworldwide.com?subject=Private%20Portfolio%20Access%20Request&body=Hi%20Equivest%20Team,%0A%0AI%20would%20like%20to%20become%20an%20investor%20and%20request%20private%20access%20credentials%20to%20view%20the%20portfolio.%0A%0AKind%20regards,"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-[#cca471] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(204,164,113,0.6)] transition-all shadow-xl group"
            >
              <Lock size={18} /> Become an Investor <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </a>
            <p className="text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">Login credentials for private access will be sent via email.</p>
          </div>
        </div>
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800">
          <Image 
            src={hero_image || "/about-bg.jpg"}
            alt="Investment Opportunity"
            width={1600}
            height={900}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Dynamic Blocks */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-12">
        {content_blocks.map((block: any, idx: number) => {
          if (block.type === 'heading') {
            return (
              <div key={block.id || idx}>
                <h2 className={`${block.size || 'text-4xl'} font-serif font-bold text-primary dark:text-white pt-8`}>{block.content}</h2>
              </div>
            )
          }
          if (block.type === 'text') {
            return <p key={block.id || idx} className={`${block.size || 'text-base'} text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap`}>{block.content}</p>
          }
          if (block.type === 'quote') {
            return (
              <blockquote key={block.id || idx} className="border-l-4 border-accent pl-6 py-4 my-8 text-xl md:text-2xl italic font-serif text-gray-700 dark:text-gray-300 bg-accent/5 rounded-r-lg">
                "{block.content}"
              </blockquote>
            )
          }
          if (block.type === 'bullet-list') {
            const items = block.content.split('\n').filter((item: string) => item.trim() !== '')
            return (
              <ul key={block.id || idx} className="list-disc list-inside space-y-3 my-6 text-gray-600 dark:text-gray-300 text-lg">
                {items.map((item: string, i: number) => (
                  <li key={i} className="leading-relaxed">{item.replace(/^- /, '')}</li>
                ))}
              </ul>
            )
          }
          if (block.type === 'cta') {
            return (
              <div key={block.id || idx} className="my-8 flex justify-start">
                <Link href={block.image_url || '/contact'} className="px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-primary transition-colors shadow-md">
                  {block.content || 'Neem Contact Op'}
                </Link>
              </div>
            )
          }
          if (block.type === 'divider') {
            return <hr key={block.id || idx} className="my-16 border-t-2 border-gray-100 dark:border-gray-800" />
          }
          if (block.type === 'image') {
            return (
              <div key={block.id || idx} className="relative w-full rounded-xl overflow-hidden my-8 shadow-lg bg-gray-50 dark:bg-gray-800">
                <Image src={block.content} alt="Content" width={1200} height={800} className="w-full h-auto object-contain" />
              </div>
            )
          }
          if (block.type === 'image-text') {
            const isImageLeft = block.size === 'image-left'
            return (
              <div key={block.id || idx} className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center my-12`}>
                {block.image_url && (
                  <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-800">
                    <Image src={block.image_url} alt="Section Image" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                )}
                <div className={`w-full ${block.image_url ? 'md:w-1/2' : ''}`}>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {block.content}
                  </p>
                </div>
              </div>
            )
          }
          return null
        })}
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-32">
        <div className="bg-primary dark:bg-gray-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-accent rounded-full blur-3xl opacity-20"></div>
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10">Ready to Enter the Arena?</h2>
          <p className="text-primary-foreground/80 dark:text-gray-300 max-w-2xl mx-auto mb-10 text-lg relative z-10">
            Whether you are looking to fully own a top prospect or join an exclusive investment syndicate, we provide a transparent, turnkey solution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/contact" className="px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-white hover:text-accent transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              Request Investment Deck <ArrowRight size={20} />
            </Link>
            <Link href="/properties" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              View Private Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary dark:text-white">ROI Calculator</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Calculate your potential Return on Investment based on historical data and projected property development strategies.</p>
          </div>
          <RoiCalculatorTabs lang="en" />
        </div>
      </div>

    </div>
  )
}
