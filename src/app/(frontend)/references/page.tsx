import { getReferences } from '@/app/actions/reference'
import { getNewsArticles } from '@/app/actions/news'
import Image from 'next/image'

export const metadata = {
  title: 'References & News | Equivest Sport Properties',
  description: 'See the success stories of properties sourced and sold by Equivest and stay updated with our latest news.',
}

export const dynamic = 'force-dynamic'

export default async function ReferencesPage() {
  const references = await getReferences()
  
  let articles = [];
  try {
    articles = await getNewsArticles() || [];
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center space-y-6 mb-8">
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-primary dark:text-white">
          Our <span className="font-semibold italic text-accent">References</span>
        </h1>
        <p className="text-lg text-secondary dark:text-gray-400 font-light max-w-2xl mx-auto">
          A track record of excellence. Discover the world-class properties that have passed through our stables and gone on to achieve greatness.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mb-32">
        {references.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 py-12">More references coming soon.</p>
        ) : (
          references.map((ref) => (
            <div key={ref.id} className="break-inside-avoid bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1 duration-300 flex flex-col items-center">
              {ref.property_name && (
                <div className="w-full bg-primary text-white p-4 text-center font-serif font-semibold">
                  {ref.property_name}
                </div>
              )}
              <div className="w-full flex justify-center p-4">
                <iframe 
                  src={`${ref.url}embed`}
                  className="w-full max-w-[400px] h-[500px]"
                  frameBorder="0" 
                  scrolling="no" 
                  allowTransparency={true}
                  allow="encrypted-media"
                ></iframe>
              </div>
            </div>
          ))
        )}
      </div>

      {/* News Section */}
      <div className="text-center space-y-8 mb-16 border-t border-gray-200 dark:border-gray-800 pt-24">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-primary dark:text-white">
          Latest <span className="font-semibold italic text-accent">News</span>
        </h2>
        <p className="text-lg text-secondary dark:text-gray-400 font-light max-w-2xl mx-auto">
          Stay updated with our recent sales, competition results, and new additions to our portfolio.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No news articles published yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <article key={article.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                 {article.image_url ? (
                   <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wider">News Image</div>
                 )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-accent font-semibold mb-2 uppercase tracking-wide">
                  {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <h3 className="text-xl font-serif font-semibold text-primary dark:text-white mb-3">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                  {article.excerpt || article.content.substring(0, 150) + '...'}
                </p>
                <button className="text-primary dark:text-white font-medium text-sm hover:text-accent transition-colors self-start mt-auto">Read More →</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
