import Navbar from '@/components/frontend/Navbar'
import Footer from '@/components/frontend/Footer'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col pt-20">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
