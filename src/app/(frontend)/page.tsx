import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowRight, Lock } from "lucide-react";
import ParallaxLogo from "@/components/frontend/ParallaxLogo";

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="flex-1 bg-[#fdfbf7] dark:bg-[#0a0a0a] overflow-x-hidden">
      {/* Shared Background for Hero and Slider */}
      <div className="relative w-full">
        <div className="absolute inset-0 opacity-90 overflow-hidden pointer-events-none">
          <Image
            src="/chimi.jpg"
            alt="Elite Jumper Chimi"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-[#fdfbf7] dark:to-[#0a0a0a]"></div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[180vh] flex flex-col items-center justify-start text-white pt-24 pb-32">
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 md:space-y-8 w-full mt-2 mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="w-2 h-2 bg-accent-light rounded-full animate-pulse"></span>
              <span className="text-accent-light uppercase tracking-[0.3em] text-xs sm:text-sm md:text-base font-bold">
                Invest in Elite Showjumpers
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif text-white leading-[1.1] tracking-tight">
              High-yield returns from world-class <span className="text-accent-light italic">equestrian talent.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-white/80 max-w-2xl mx-auto leading-relaxed">
              Securing high-yield returns through the acquisition of world-class equestrian talent.
            </p>
            
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/properties"
                className="bg-accent text-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all shadow-xl"
              >
                View Portfolio
              </Link>
              <Link
                href="/investors"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-all shadow-xl"
              >
                Want to invest
              </Link>
            </div>
          </div>

          <ParallaxLogo />
        </section>

        {/* Explore the Sport Portfolio */}
        <PortfolioSlideshowPreview />
      </div>

      {/* Want to Invest CTA - Floating Card */}
      <section className="pt-8 pb-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3rem] shadow-2xl bg-primary transform hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute inset-0 bg-[url('/chimi.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/40"></div>
            
            <div className="relative z-10 p-12 md:p-20 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Want to <span className="text-accent italic">Invest?</span></h2>
                <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light">
                  Join Equivest Worldwide and become part of an exclusive network of investors acquiring elite equestrian talent. Our proven track record and data-driven approach maximize both sport success and financial returns.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a 
                    href="mailto:invest@equivestworldwide.com?subject=Private%20Portfolio%20Access%20Request&body=Hi%20Equivest%20Team,%0A%0AI%20would%20like%20to%20become%20an%20investor%20and%20request%20private%20access%20credentials%20to%20view%20the%20portfolio.%0A%0AKind%20regards,"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-[#cca471] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(204,164,113,0.6)] transition-all shadow-xl group"
                  >
                    <Lock size={18} /> Become an Investor <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                  <Link href="/contact" className="bg-transparent border border-white/30 text-white px-8 py-4 font-bold uppercase tracking-widest rounded-full text-center hover:bg-white/10 transition-all backdrop-blur-sm">
                    Contact Us
                  </Link>
                </div>
                <p className="text-xs text-white/40 mt-6 font-bold uppercase tracking-widest">
                  Login credentials for private access will be sent via email.
                </p>
              </div>
              <div className="hidden lg:block w-1/3 relative">
                 <div className="absolute -inset-10 bg-accent/20 blur-[100px] rounded-full"></div>
                 <Image src="/logo.png" alt="Equivest Shield" width={300} height={300} className="w-full h-auto object-contain opacity-80 mix-blend-screen drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <ReferencesPreview />

      {/* Latest News Section */}
      <LatestNewsPreview />
    </main>
  );
}

import { getNewsArticles } from '@/app/actions/news'
import { getPublicProperties } from '@/app/actions/property'
import { getReferences } from '@/app/actions/reference'
import PropertySlideshow from '@/components/frontend/PropertySlideshow'

async function PortfolioSlideshowPreview() {
  let properties = [];
  try {
    properties = await getPublicProperties() || [];
  } catch (e) {
    console.error(e);
  }
  return <PropertySlideshow properties={properties} />;
}

async function ReferencesPreview() {
  let references = [];
  try {
    references = await getReferences() || [];
    references = references.slice(0, 3); // Take top 3
  } catch (e) {
    console.error(e);
  }

  if (references.length === 0) {
    references = [
      {
        id: 'dummy1',
        property_name: 'Equivest Royal Flush',
        image_url: '/success1.png',
        sold_to_country: 'United States'
      },
      {
        id: 'dummy2',
        property_name: 'Equivest Grand Prix',
        image_url: '/success2.png',
        sold_to_country: 'Germany'
      },
      {
        id: 'dummy3',
        property_name: 'Equivest Platinum',
        image_url: '/success3.png',
        sold_to_country: 'United Arab Emirates'
      }
    ];
  }

  return (
    <section className="pt-10 pb-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold block mb-4">Proven Success</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary dark:text-white mb-6">
            Global <span className="italic text-accent">References</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            From the European heartland to the most prestigious arenas in the world, our elite athletes consistently prove their immense value. Discover some of our proudest alumni who have achieved greatness on the global stage after joining the Equivest portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {references.map((ref: any) => (
            <Link href="/references" key={ref.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-xl">
                {ref.image_url ? (
                  <Image 
                    src={ref.image_url} 
                    alt={ref.property_name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <Trophy className="text-gray-400 w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Trophy size={16} className="text-accent" />
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">Top Performer</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold mb-2 group-hover:text-white transition-colors">{ref.property_name}</h3>
                  <div className="w-10 h-1 bg-accent mb-3"></div>
                  <p className="text-sm text-white/80 uppercase tracking-widest font-medium">Exported to: {ref.sold_to_country}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/references" className="inline-flex items-center gap-3 px-8 py-4 border border-gray-300 dark:border-gray-700 rounded-full text-primary dark:text-white font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-colors group">
            View All References <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Add a component at the bottom of the file to fetch and show news

async function LatestNewsPreview() {
  let articles = [];
  try {
    articles = await getNewsArticles() || [];
    articles = articles.slice(0, 3); // Only take latest 3
  } catch (e) {
    console.error(e);
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-20 bg-transparent relative z-10">
      {/* Soft divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary dark:text-white">
              Latest <span className="italic text-accent">Updates</span>
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Discover our recent additions, competition results, and general news.</p>
          </div>
          <Link href="/news" className="hidden sm:flex items-center text-sm font-bold uppercase tracking-wider text-primary dark:text-white hover:text-accent transition-colors">
            View All News &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <Link href={`/news`} key={article.id} className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
              <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                {article.image_url ? (
                  <Image 
                    src={article.image_url} 
                    alt={article.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm uppercase tracking-wider">News</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                  {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
                  {article.excerpt || article.content.substring(0, 150) + '...'}
                </p>
                <span className="text-sm font-medium text-primary dark:text-white group-hover:text-accent transition-colors flex items-center">
                  Read More <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 sm:hidden text-center">
          <Link href="/news" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-full">
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}
