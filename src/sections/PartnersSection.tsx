import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Bot, Building2, type LucideIcon } from 'lucide-react';
import { usePartners } from '@/hooks/usePartners';

gsap.registerPlugin(ScrollTrigger);

// Static icon mapping — WP can't provide Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
  'softexpert-2': Layers,
  'biti9-rpa': Bot,
};

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { partners, loading } = usePartners();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || loading || partners.length === 0) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: '-30vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      cardsRef.current.forEach((card, i) => {
        if (card) {
          scrollTl.fromTo(
            card,
            { x: '60vw', opacity: 0, rotateY: 10 },
            { x: 0, opacity: 1, rotateY: 0, ease: 'none' },
            0.1 + i * 0.08
          );
        }
      });

      // EXIT (70% - 100%)
      cardsRef.current.forEach((card) => {
        if (card) {
          scrollTl.fromTo(
            card,
            { x: 0, opacity: 1 },
            { x: '-40vw', opacity: 0, ease: 'power2.in' },
            0.7
          );
        }
      });

      scrollTl.fromTo(
        headlineRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

    }, section);

    return () => ctx.revert();
  }, [partners, loading]);

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loading]);

  // Use WP data or fallback skeletons with same structure
  const items = loading
    ? [
        { id: 0, slug: 'softexpert-2', name: 'SOFTEXPERT', description: '', tags: ['GESTÃO', 'CONFORMIDADE', 'EXCELÊNCIA'], skeleton: true as const },
        { id: 1, slug: 'biti9-rpa', name: 'BITI9', description: '', tags: ['RPA', 'AUTOMAÇÃO', 'IA'], skeleton: true as const },
      ]
    : partners.map((p) => ({ ...p, skeleton: false as const }));

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-venture-black z-[80]"
    >
      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute"
        style={{ left: '6vw', top: '14vh', width: '60vw' }}
      >
        <h2 className="headline-lg text-venture-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
          <span className="block">Nossas</span>
          <span className="block">
            Parcer<span className="text-accent">ias</span>
          </span>
        </h2>
      </div>

      {/* Partner Cards */}
      {items.map((partner, index) => {
        const Icon = ICON_MAP[partner.slug] ?? Building2;
        const leftPos = 6 + index * 30;

        return (
          <div
            key={partner.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute card-border bg-venture-charcoal/30 backdrop-blur-sm flex flex-col justify-between p-6 md:p-8"
            style={{
              left: `${leftPos}vw`,
              top: '42vh',
              width: '32vw',
              height: '44vh',
              maxWidth: '420px',
              perspective: '1000px',
            }}
          >
            {/* Icon */}
            <div className="mb-4">
              <Icon className="w-8 h-8 text-accent" />
            </div>

            {/* Content */}
            <div>
              <h3 className="font-display font-bold text-venture-white text-xl md:text-2xl uppercase tracking-tight mb-3">
                {partner.name}
              </h3>
              {partner.skeleton ? (
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-venture-charcoal/30 animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-venture-charcoal/30 animate-pulse rounded" />
                </div>
              ) : (
                <p className="text-venture-gray text-sm md:text-base leading-relaxed mb-4">
                  {partner.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {partner.tags.map((tag) => (
                  <span
                    key={tag}
                    className="micro-label text-venture-gray px-2 py-1 bg-venture-black/50 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
