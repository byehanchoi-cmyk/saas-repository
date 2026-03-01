import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { FocusModeSection } from '@/components/landing/FocusModeSection'
import { PricingSection } from '@/components/landing/PricingSection'

export default function Home() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden">
      <main className="flex flex-col items-center w-full">
        <HeroSection />
        <FeaturesSection />
        <FocusModeSection />
        <PricingSection />
      </main>
    </div>
  );
}
