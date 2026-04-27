export const metadata = {
  title: 'About Us | Antigravity Sport Properties',
  description: 'Learn more about our passion for elite sport properties and our global network.',
}

export const dynamic = 'force-dynamic'

import { getTeamMembers } from '@/app/actions/team'
import { getPageContent } from '@/app/actions/pages'
import Image from 'next/image'
import Link from 'next/link'

export default async function AboutPage() {
  let team = [];
  try {
    const rawTeam = await getTeamMembers() || [];
    team = [...rawTeam];
    
    // Hardcode overrides for Tom van Biene and Tyler Petrie
    let tom = team.find((m: any) => m.name.toLowerCase().includes('tom'));
    let tyler = team.find((m: any) => m.name.toLowerCase().includes('tyler'));
    
    const tomBio = "As the Head of IT and Lead Developer at Equivest, Tom van Biene brings over 5 years of specialized experience in designing, hosting, and managing high-end CMS and website infrastructures. He has successfully automated the entire digital ecosystem—ranging from intricate inventory management to dynamic scheduling systems. His architectural vision ensures that the platform is robust, extremely fast, and secure.";
    
    if (tom) {
      tom.role = 'Head of IT & Lead Developer';
      tom.bio = tomBio;
      tom.sort_order = -10;
    } else {
      tom = {
        id: 'tom-override',
        name: 'Tom van Biene',
        role: 'Head of IT & Lead Developer',
        bio: tomBio,
        image_url: null,
        sort_order: -10
      };
      team.push(tom);
    }
    
    if (tyler) {
      tyler.sort_order = -9;
    } else {
      tyler = {
        id: 'tyler-override',
        name: 'Tyler Petrie',
        role: 'Director',
        bio: 'Managing global operations and high-end investments.',
        image_url: null,
        sort_order: -9
      };
      team.push(tyler);
    }
    
    team.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  } catch (error) {
    console.error("Error fetching team members:", error);
  }

  let pageData = await getPageContent('about')

  if (!pageData) {
    pageData = {
      title: 'Legacy of Excellence',
      hero_image: '/wellington_showjumper.png',
      content_blocks: [
        { id: '1', type: 'text', content: 'Equivest is a leading player with over 25 years of experience and a proven track record in the equestrian world. We facilitate high-end investments in world-class showjumpers from the Netherlands, Germany, and Belgium, offering our investors unique opportunities for significant returns through precision selection and expert management.', size: 'text-xl' },
        { id: '2', type: 'text', content: 'Show jumping has evolved into a highly professional global sport. Investing in genetically superior youngsters and producing them into 5-Star Grand Prix athletes offers a unique, high-yield asset class.', size: 'text-xl' },
        { id: '3', type: 'text', content: 'Our syndicate model ensures that you co-own elite prospects alongside industry professionals. From world-class training in Europe to targeted global competition, we manage the entire lifecycle to maximize both sport success and financial return.', size: 'text-xl' }
      ]
    }
  }

  const { title, hero_image, content_blocks } = pageData

  return (
    <div className="pt-6 pb-16 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-primary dark:text-white">
            {title}
          </h1>
          <h2 className="text-2xl font-serif text-secondary dark:text-gray-300">About Equivest</h2>
          <div className="space-y-6 text-xl md:text-2xl text-gray-800 dark:text-gray-300 font-medium leading-relaxed text-center sm:text-left">
            {content_blocks.map((block: any, index: number) => {
              const isFinancialReturn = block.type === 'text' && block.content.toLowerCase().includes('financial return');
              
              let BlockComponent = null;
              if (block.type === 'text') BlockComponent = <p className={block.size || 'text-xl'}>{block.content}</p>;
              else if (block.type === 'heading') BlockComponent = <h3 className={`${block.size || 'text-2xl'} font-bold mt-8 mb-4`}>{block.content}</h3>;
              else if (block.type === 'quote') BlockComponent = <blockquote className="text-2xl italic font-serif border-l-4 border-accent pl-6 my-8">{block.content}</blockquote>;
              else if (block.type === 'bullet-list') BlockComponent = (
                <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
                  {block.content.split('\n').filter((item: string) => item.trim() !== '').map((item: string, i: number) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{item.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
              else if (block.type === 'cta') BlockComponent = (
                <div className="mt-8 mb-4">
                  <Link href={block.image_url || '/'} className="inline-block bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-secondary transition-colors">
                    {block.content}
                  </Link>
                </div>
              );
              else if (block.type === 'divider') BlockComponent = <div className="w-24 h-1 bg-accent mx-auto my-12" />;
              else if (block.type === 'image') BlockComponent = (
                <div className="w-full relative rounded-2xl overflow-hidden shadow-lg my-8">
                  <Image src={block.content} alt="Image content" width={1200} height={800} className="w-full h-auto object-cover" />
                </div>
              );

              return (
                <div key={block.id || index}>
                  {BlockComponent}
                  {isFinancialReturn && (
                    <div className="w-full relative mt-16 mb-12 rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-900 border border-white/10 group">
                      <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                      >
                        <source src="https://cdn.pixabay.com/video/2021/08/13/84920-588320496_large.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-[#0A192F]/20 to-transparent"></div>
                      <div className="absolute bottom-8 left-8">
                        <div className="inline-block bg-accent text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                          Premium Investment
                        </div>
                        <div className="text-white font-serif italic text-2xl md:text-3xl drop-shadow-md">
                          1.60m Grand Prix Prospect
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Media Blocks */}
          <div className="grid grid-cols-1 gap-8 mt-16">
            {hero_image && (
              <div className="h-64 sm:h-[500px] w-full relative bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                {hero_image.toLowerCase().endsWith('.mp4') || hero_image.toLowerCase().endsWith('.webm') || hero_image.toLowerCase().endsWith('.mov') ? (
                  <video src={hero_image} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <Image src={hero_image} alt="Hero Media 1" fill className="object-cover" priority />
                )}
              </div>
            )}
            
            {pageData.hero_image_2 && (
              <div className="h-64 sm:h-[500px] w-full relative bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                {pageData.hero_image_2.toLowerCase().endsWith('.mp4') || pageData.hero_image_2.toLowerCase().endsWith('.webm') || pageData.hero_image_2.toLowerCase().endsWith('.mov') ? (
                  <video src={pageData.hero_image_2} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <Image src={pageData.hero_image_2} alt="Hero Media 2" fill className="object-cover" priority />
                )}
              </div>
            )}
            
            {/* Fallback if both are empty */}
            {!hero_image && !pageData.hero_image_2 && (
              <div className="h-64 sm:h-[500px] w-full relative bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                <Image src="/wellington_showjumper.png" alt="About image" fill className="object-cover" priority />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-primary dark:text-white">
              Meet The <span className="font-semibold italic text-accent">Team</span>
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </div>

          {team.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xl">
              The team is being updated. Please check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {team.map((member: any) => (
                <div key={member.id} className="group flex flex-col items-center text-center">
                  <div className="relative w-56 h-56 mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group-hover:border-accent transition-colors duration-300">
                    {member.image_url ? (
                      <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-6xl text-gray-400 font-serif">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-primary dark:text-white mb-2">{member.name}</h3>
                  <p className="text-lg text-accent uppercase tracking-widest font-bold mb-6">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-md">
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
