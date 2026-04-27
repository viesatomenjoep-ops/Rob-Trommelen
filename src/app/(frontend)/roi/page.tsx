import RoiCalculatorTabs from '@/components/roi/RoiCalculatorTabs';

export const metadata = {
  title: 'Return on Investment | Equivest',
  description: 'Discover the financial advantages of investing in premium sport properties.',
}

export default function ROIPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-primary dark:text-white">
          Return on <span className="font-semibold italic text-accent">Investment</span>
        </h1>
        <p className="text-lg text-secondary dark:text-gray-400 font-light leading-relaxed">
          Investing in elite sport properties offers a unique alternative asset class. With expert scouting, professional training, and strategic placement, we maximize both athletic potential and financial return.
        </p>
      </div>

      <div className="w-full">
        <RoiCalculatorTabs lang="en" />
      </div>
    </div>
  )
}
