import { SpaceBackground, GridOverlay } from '../components/space-background';
import { Header } from '../components/header-new';
import { HeroSection } from '../components/hero-section-new';
import { HowItWorks } from '../components/how-it-works-new';
import { MeetAgents } from '../components/meet-agents-new';
import { DemoPreview } from '../components/demo-preview-new';
import { Footer } from '../components/footer-new';

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated space background */}
      <SpaceBackground />
      <GridOverlay />

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <HowItWorks />
          <MeetAgents />
          <DemoPreview />
        </main>
        <Footer />
      </div>
    </div>
  );
}