import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import CaseValeSection from './sections/CaseValeSection';
import ProcessSection from './sections/ProcessSection';
import InsightsSection from './sections/InsightsSection';
import CaseAngloSection from './sections/CaseAngloSection';
import MetricsSection from './sections/MetricsSection';
import PartnersSection from './sections/PartnersSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';
import { useCases } from './hooks/useCases';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const { vale, anglo, loading: casesLoading } = useCases();

  useEffect(() => {
    // Configuração global do ScrollTrigger
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    // Refresh após tudo estar montado
    const ctx = gsap.context(() => {
      // Aguarda um frame para garantir que o DOM está pronto
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Recalculate ScrollTrigger positions after WP data loads
  useEffect(() => {
    if (!casesLoading) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [casesLoading]);

  return (
    <div className="relative bg-venture-black min-h-screen">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main ref={mainRef} className="relative">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Capabilities Mosaic */}
        <div id="capabilities">
          <CapabilitiesSection />
        </div>

        {/* Section 3: Case Study - Vale */}
        <div id="cases">
          <CaseValeSection data={vale} loading={casesLoading} />
        </div>

        {/* Section 4: Process Timeline */}
        <ProcessSection />

        {/* Section 5: Insights Grid */}
        <div id="insights">
          <InsightsSection />
        </div>

        {/* Section 6: Case Study - Anglo American */}
        <CaseAngloSection data={anglo} loading={casesLoading} />

        {/* Section 7: Metrics Dashboard */}
        <MetricsSection />

        {/* Section 8: Partnerships */}
        <PartnersSection />

        {/* Section 9: Contact CTA */}
        <div id="contact">
          <ContactSection />
        </div>

        {/* Section 10: Footer */}
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
