'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function LanguageSwitcher({ expandDirection = 'down' }: { expandDirection?: 'down' | 'left' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Read from localStorage first for maximum reliability
    const savedLang = localStorage.getItem('equivest_lang');
    if (savedLang) {
      setCurrentLang(savedLang);
    } else {
      // Read the googtrans cookie as fallback
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      }
      
      const googtrans = getCookie('googtrans');
      if (googtrans) {
        const match = googtrans.match(/\/([a-z]{2})$/i)
        if (match && match[1]) {
          setCurrentLang(match[1])
        }
      }
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (code: string) => {
    if (code === currentLang) {
      setIsOpen(false)
      return
    }

    const host = window.location.hostname;
    const baseHost = host.replace(/^www\./, '');

    // Save reliably
    localStorage.setItem('equivest_lang', code);
    setCurrentLang(code);
    setIsOpen(false);

    if (code === 'en') {
      // Clear the cookie to revert to original
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${baseHost};`;
      window.location.reload();
      return;
    }

    // Try to trigger the native hidden google translate dropdown directly for an instant translation without reload
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    } else {
      // Fallback: set the cookie aggressively and reload
      document.cookie = `googtrans=/en/${code}; path=/;`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=${host};`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=.${baseHost};`;
      window.location.reload()
    }
  }

  const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]

  const isLeft = expandDirection === 'left'

  return (
    <div 
      className="relative z-50 notranslate w-10 h-10 sm:w-12 sm:h-12" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className={`absolute ${isLeft ? 'right-0 top-0 flex flex-row items-center' : 'top-0 right-0 flex flex-col items-center'} overflow-hidden transition-all duration-500 ease-in-out bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm ${
          isOpen ? (isLeft ? 'w-[200px] h-10 sm:h-12 opacity-100 justify-end' : 'w-10 sm:w-12 h-[160px] opacity-100') : 'w-10 sm:w-12 h-10 sm:h-12 opacity-100'
        }`}
      >
        {/* Current Language Trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0 hover:text-accent transition-colors focus:outline-none ${isLeft && isOpen ? 'order-2' : ''}`}
          aria-label="Toggle Language"
        >
          <span className="text-xs sm:text-sm font-bold text-primary dark:text-white uppercase tracking-[0.2em]">{currentLang}</span>
        </button>

        {/* Slide-out options */}
        <div className={`flex ${isLeft ? 'flex-row items-center pr-2 order-1' : 'flex-col items-center pb-2'} transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          {LANGUAGES.filter(l => l.code !== currentLang).map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-3 ${isLeft ? 'py-2' : 'py-1.5'} text-xs sm:text-sm font-bold text-gray-700 hover:text-accent dark:text-gray-300 dark:hover:text-white uppercase tracking-[0.1em] transition-colors`}
            >
              {lang.code}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
