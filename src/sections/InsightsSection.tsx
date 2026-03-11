import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight } from 'lucide-react';
import { useInsights } from '@/hooks/useInsights';

gsap.registerPlugin(ScrollTrigger);

const SKELETON_COUNT = 6;

export default function InsightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { insights, loading } = useInsights(SKELETON_COUNT);

  // GSAP animations — re-run when data arrives
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation (staggered)
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
              delay: (i % 3) * 0.1,
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [insights]);

  // Refresh ScrollTrigger positions after data loads
  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loading]);

  // Items to render: real data or skeleton placeholders
  const items = loading
    ? Array.from({ length: SKELETON_COUNT }, (_, i) => ({ id: i, skeleton: true as const }))
    : insights.map((insight) => ({ ...insight, skeleton: false as const }));

  return (
    <section
      ref={sectionRef}
      className="relative bg-venture-black z-50 py-20 md:py-32"
    >
      {/* Heading Block */}
      <div
        ref={headingRef}
        className="px-[6vw] mb-12 md:mb-16"
      >
        <h2 className="headline-lg text-venture-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          Insights
        </h2>
        <p className="text-venture-gray text-lg max-w-xl">
          Relatórios, análises e tendências para decisões melhores.
        </p>
      </div>

      {/* Grid */}
      <div className="px-[6vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, index) => (
          <a
            key={item.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            href={item.skeleton ? undefined : item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer block"
          >
            {item.skeleton ? (
              <>
                {/* Skeleton Thumbnail */}
                <div className="relative overflow-hidden mb-4 aspect-[16/10] bg-venture-charcoal/30 animate-pulse rounded" />
                {/* Skeleton Meta */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-16 bg-venture-charcoal/30 animate-pulse rounded" />
                  <div className="h-3 w-12 bg-venture-charcoal/30 animate-pulse rounded" />
                </div>
                {/* Skeleton Title */}
                <div className="h-5 w-full bg-venture-charcoal/30 animate-pulse rounded mb-1" />
                <div className="h-5 w-2/3 bg-venture-charcoal/30 animate-pulse rounded" />
              </>
            ) : (
              <>
                {/* Thumbnail */}
                <div className="relative overflow-hidden mb-4 aspect-[16/10]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: 'grayscale(30%) contrast(1.05)' }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="micro-label text-accent">{item.category}</span>
                  <span className="flex items-center gap-1 text-venture-gray text-xs">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-venture-white font-display font-semibold text-lg leading-snug group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-venture-gray text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Ler artigo</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
