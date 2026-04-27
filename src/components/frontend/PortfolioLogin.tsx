'use client'

import { useState } from 'react'
import { loginPortfolio } from '@/app/actions/portfolio-auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PortfolioLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await loginPortfolio(username, password)
    if (res.success) {
      router.refresh()
    } else {
      setError(res.error || 'Fout')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blur effect for luxury feel */}
      <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-900/50 z-0"></div>
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Equivest" 
            width={100} 
            height={100} 
            className="w-24 h-24 object-contain animate-[spin_8s_linear_infinite] mb-6 drop-shadow-md" 
          />
          <h2 className="text-2xl font-serif text-primary dark:text-white text-center tracking-wide">Private Collection Access</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">Voer de toegangscode in om de exclusieve collectie te bekijken.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm text-center font-medium border border-red-100 dark:border-red-900/30">{error}</div>}
          <div>
            <input 
              type="text" 
              placeholder="Gebruikersnaam" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Wachtwoord" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-primary transition-colors shadow-lg active:scale-95 duration-200 uppercase tracking-wider text-sm">
            Inloggen
          </button>
        </form>
      </div>
    </div>
  )
}
