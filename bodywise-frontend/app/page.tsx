import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { WhyBodyWiseSection } from "@/components/sections/why-bodywise";
import { CoreFeaturesSection } from "@/components/sections/core-features";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { EducationHubSection } from "@/components/sections/education-hub";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5ebe3] pb-16">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <HeroSection />
        <WhyBodyWiseSection />
        <CoreFeaturesSection />
        <TestimonialsSection />
        <EducationHubSection />
      </main>
      <Footer />
    </div>
  );
}

