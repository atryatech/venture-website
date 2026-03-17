import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CapabilitiesSection from '@/sections/CapabilitiesSection';
import CaseAngloSection from '@/sections/CaseAngloSection';
import CaseValeSection from '@/sections/CaseValeSection';
import ContactSection from '@/sections/ContactSection';
import HeroSection from '@/sections/HeroSection';
import InsightsSection from '@/sections/InsightsSection';
import MetricsSection from '@/sections/MetricsSection';
import PartnersSection from '@/sections/PartnersSection';
import ProcessSection from '@/sections/ProcessSection';
import { useCases } from '@/hooks/useCases';
import { usePageMeta } from '@/hooks/usePageMeta';
import { scrollToHomeSection } from '@/lib/site-navigation';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { vale, anglo, loading: casesLoading } = useCases();

  usePageMeta({
    title: 'Venture | Consultoria de alta performance',
    description:
      'Consultoria especializada em estratégia, transformação digital, performance e gestão de riscos com execução orientada a resultado.',
    canonical: '/',
    ogTitle: 'Venture | Consultoria de alta performance',
    ogDescription:
      'Estratégia, transformação digital, performance e gestão de projetos em páginas internas integradas ao WordPress.',
    ogImage: '/hero_portrait.jpg',
  });

  useEffect(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    const ctx = gsap.context(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!casesLoading) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [casesLoading]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace('#', '');
    requestAnimationFrame(() => {
      scrollToHomeSection(sectionId);
    });
  }, [location.hash]);

  return (
    <div ref={mainRef} className="relative">
      <HeroSection />

      <div id="capabilities">
        <CapabilitiesSection />
      </div>

      <div id="cases">
        <CaseValeSection data={vale} loading={casesLoading} />
      </div>

      <ProcessSection />

      <div id="insights">
        <InsightsSection />
      </div>

      <CaseAngloSection data={anglo} loading={casesLoading} />

      <MetricsSection />

      <PartnersSection />

      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
}