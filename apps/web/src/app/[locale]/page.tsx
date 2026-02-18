import { PageWrapper } from "@/components/layout/page-wrapper";
import { HeroSection } from "@/app/[locale]/_components/hero-section";
import { StatsSection } from "@/app/[locale]/_components/stats-section";
import { FeaturesSection } from "@/app/[locale]/_components/features-section";
import { FinalCTASection } from "@/app/[locale]/_components/final-cta-section";
import { MainContentAreaWrapper } from "@/app/[locale]/_components/main-content-area-wrapper";
import { ExercisesSection } from "@/app/[locale]/_components/exercises-section";

export default async function Home() {
  return (
    <PageWrapper className="overflow-hidden p-0 md:p-0 lg:p-0">
      <HeroSection />
      <StatsSection />
      <MainContentAreaWrapper>
        <FeaturesSection />
        <ExercisesSection />
        <FinalCTASection />
      </MainContentAreaWrapper>
    </PageWrapper>
  );
}
