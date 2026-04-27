'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks({ user, isMobile = false, setIsOpen, logoutAction }: { user: any, isMobile?: boolean, setIsOpen?: (v: boolean) => void, logoutAction?: any }) {
  const pathname = usePathname()

  const links = [
    { href: '/explore', label: 'Explore Tools' },
    { href: '/about', label: 'About Us' },
    { href: '/properties', label: 'Portfolio' },
    { href: '/references', label: 'References' },
    { href: '/investors', label: 'Want to invest?' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  if (isMobile) {
    return (
      <>
        <Link onClick={() => setIsOpen?.(false)} href="/" className="text-xl font-serif font-bold text-primary hover:text-accent transition-colors uppercase">
          Return to Homepage
        </Link>
        {user ? (
          <>
            <Link onClick={() => setIsOpen?.(false)} href="/admin" className="text-xl font-serif font-bold text-accent hover:text-primary transition-colors uppercase">
              Admin Dashboard
            </Link>
            <form action={logoutAction} className="inline">
              <button type="submit" onClick={() => setIsOpen?.(false)} className="text-xl font-serif font-bold text-accent hover:text-primary transition-colors uppercase text-left w-full">
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link onClick={() => setIsOpen?.(false)} href="/login" className="text-xl font-serif font-bold text-accent hover:text-primary transition-colors uppercase">
            Login
          </Link>
        )}
        
        {links.map((link) => (
          <Link 
            key={link.href}
            onClick={() => setIsOpen?.(false)} 
            href={link.href} 
            className={`text-xl font-serif font-bold transition-colors uppercase ${isActive(link.href) ? 'text-accent' : 'text-primary hover:text-accent'}`}
          >
            {link.label}
          </Link>
        ))}
      </>
    )
  }

  return (
    <>
      <Link href="/" className={`text-[11px] xl:text-sm font-bold uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${isActive('/') ? 'text-accent' : 'text-primary hover:text-accent'}`}>
        Return to Homepage
      </Link>

      {user ? (
        <form action={logoutAction}>
          <button type="submit" className="text-[11px] xl:text-sm font-bold uppercase tracking-wider text-accent hover:text-primary transition-colors py-2 whitespace-nowrap">
            Logout
          </button>
        </form>
      ) : (
        <Link href="/login" className={`text-[11px] xl:text-sm font-bold uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${isActive('/login') ? 'text-accent' : 'text-accent hover:text-primary'}`}>
          Login
        </Link>
      )}
      
      {links.map((link) => (
        <Link 
          key={link.href}
          href={link.href} 
          className={`text-[11px] xl:text-sm font-bold uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${isActive(link.href) ? 'text-accent' : 'text-primary hover:text-accent'}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}
