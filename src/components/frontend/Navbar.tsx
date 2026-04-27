import Link from 'next/link'
import Image from 'next/image'
import ScrollLogo from './ScrollLogo'
import MobileMenu from './MobileMenu'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#e6e6e6]/95 backdrop-blur-md border-b border-gray-100 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 relative w-full">
          
          {/* Logo Left */}
          <div className="flex items-center space-x-4 z-[110]">
            <Link href="/" className="group relative block">
              <ScrollLogo>
                <Image 
                  src="/logo.png" 
                  alt="Equivest Logo" 
                  width={56} 
                  height={56} 
                  className="w-14 h-14 object-contain transition-transform duration-500 group-hover:scale-110" 
                />
              </ScrollLogo>
            </Link>
            <Link href="/" className="flex flex-col text-left justify-center shrink-0">
              <span className="text-2xl font-serif font-bold tracking-tight text-primary uppercase leading-none">Equivest</span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-primary/90 uppercase mt-1 self-end">Since 1995</span>
            </Link>
          </div>

          {/* Desktop Navigation Center (REMOVED due to too many items overlapping logo) */}

          {/* Right side controls & Mobile menu button */}
          <div className="flex items-center gap-4 ml-auto z-[110]">
            <LanguageSwitcher expandDirection="down" />
            <MobileMenu />
          </div>

        </div>
      </div>
    </header>
  )
}
