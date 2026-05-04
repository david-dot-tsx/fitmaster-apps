import { PageWrapper } from "@/components/layout/page-wrapper";
import { HeroSection } from "@/features/landing/hero-section";
import { StatsSection } from "@/features/landing/stats-section";
import { FeaturesSection } from "@/features/landing/features-section";
import { FinalCTASection } from "@/features/landing/final-cta-section";
import { MainContentAreaWrapper } from "@/features/landing/main-content-area-wrapper";
import { ExercisesSection } from "@/features/landing/exercises-section";

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
