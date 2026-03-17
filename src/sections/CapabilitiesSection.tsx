import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Workflow, Shield, Cpu, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getContentPath, serviceHighlights } from '@/lib/wordpress-content';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    id: 'estrategia',
    label: 'ESTRATÉGIA',
    title: 'Estratégia e Sustentabilidade, com visão de longo prazo.',
    icon: Shield,
    slug: serviceHighlights[0].slug,
  },
  {
    id: 'digital',
    label: 'TRANSFORMAÇÃO',
    title: 'Transformação Digital com uso de tecnologias inovadoras.',
    icon: Cpu,
    slug: serviceHighlights[1].slug,
  },
  {
    id: 'perf',
    label: 'PERFORMANCE',
    title: 'Performance e Tecnologia em automação e TI.',
    icon: Workflow,
    slug: serviceHighlights[2].slug,
  },
  {
    id: 'projetos',
    label: 'PROJETOS',
    title: 'Gestão em Projetos de Capital, controlando riscos e prazos.',
    icon: Building2,
    slug: serviceHighlights[3].slug,
  },
];

export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const tilesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      // Headline
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Paragraph
      scrollTl.fromTo(
        paragraphRef.current,
        { x: '50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.06
      );

      // Tiles (staggered)
      tilesRef.current.forEach((tile, i) => {
        if (tile) {
          scrollTl.fromTo(
            tile,
            { y: '100vh', opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, ease: 'none' },
            0.1 + i * 0.06
          );
        }
      });

      // Accent bars
      barsRef.current.forEach((bar, i) => {
        if (bar) {
          scrollTl.fromTo(
            bar,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none' },
            0.18 + i * 0.04
          );
        }
      });

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      tilesRef.current.forEach((tile) => {
        if (tile) {
          scrollTl.fromTo(
            tile,
            { y: 0, opacity: 1 },
            { y: '-60vh', opacity: 0, ease: 'power2.in' },
            0.7
          );
        }
      });

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        paragraphRef.current,
        { x: 0, opacity: 1 },
        { x: '30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-venture-black z-20"
    >
      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute"
        style={{ left: '6vw', top: '14vh', width: '44vw' }}
      >
        <h2 className="headline-lg text-venture-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
          <span className="block">Consultoria</span>
          <span className="block">
            Especializ<span className="text-accent">ada</span>
          </span>
        </h2>
      </div>

      {/* Paragraph */}
      <p
        ref={paragraphRef}
        className="absolute text-venture-gray text-base md:text-lg leading-relaxed"
        style={{ left: '54vw', top: '14vh', width: '40vw', maxWidth: '420px' }}
      >
        Unimos metodologia e execução para entregar resultados em 90 dias.
      </p>

      {/* Mosaic Tiles */}
      {capabilities.map((cap, index) => {
        const Icon = cap.icon;
        const leftPos = 6 + index * 22;

        return (
          <Link
            key={cap.id}
            ref={(el) => { tilesRef.current[index] = el; }}
            to={getContentPath('service', cap.slug)}
            className="absolute card-border bg-venture-charcoal/50 backdrop-blur-sm flex flex-col justify-between p-6 md:p-8"
            style={{
              left: `${leftPos}vw`,
              top: '38vh',
              width: '21vw',
              height: '52vh',
              maxWidth: '300px',
            }}
          >
            {/* Accent Bar */}
            <div
              ref={(el) => { barsRef.current[index] = el; }}
              className="accent-bar absolute top-0 left-0 right-0"
              style={{ transformOrigin: 'left' }}
            />

            {/* Label */}
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-accent" />
              <span className="micro-label text-venture-white">{cap.label}</span>
            </div>

            {/* Caption */}
            <p className="text-venture-gray text-sm md:text-base leading-relaxed">
              {cap.title}
            </p>
          </Link>
        );
      })}
    </section>
  );
}
