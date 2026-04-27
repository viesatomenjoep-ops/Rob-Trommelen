export const metadata = {
  title: 'News | Antigravity Sport Properties',
  description: 'Latest updates, sales, and competition results from Antigravity.',
}

export const revalidate = 3600

import { getNewsArticles } from '@/app/actions/news'
import Image from 'next/image'

export default async function NewsPage() {
  let articles = [];
  try {
    articles = await getNewsArticles() || [];
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center space-y-8 mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-primary dark:text-white">
          Latest <span className="font-semibold italic text-accent">News</span>
        </h1>
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
                {/* Future: link to full article page */}
                <button className="text-primary dark:text-white font-medium text-sm hover:text-accent transition-colors self-start mt-auto">Read More →</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
