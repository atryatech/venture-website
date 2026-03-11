import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '@/types/wordpress';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  data?: CaseStudy | null;
  loading?: boolean;
}

export default function CaseValeSection({ data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Fallback content when WP data hasn't loaded yet
  const client = data?.client ?? 'Vale';
  const headline = data?.headline ?? "Abordagem 'Fazer mais com Menos' no maior projeto de minério de ferro do mundo, o S11D.";
  const body = data?.body ?? 'Mapeamento, automação e implantação de sistemas de gestão para garantir o controle e a entrega do empreendimento.';
  const image = data?.image || '/case_vale.jpg';
  const link = data?.link ?? '#';

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        imageRef.current,
        { x: '-60vw', opacity: 0, scale: 1.06 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        hairlineRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        textRef.current,
        { x: '50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18
      );

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        imageRef.current,
        { x: 0, opacity: 1 },
        { x: '-30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        textRef.current,
        { x: 0, opacity: 1 },
        { x: '30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        hairlineRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        ctaRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-venture-black z-30"
    >
      {/* Large Case Image (Left) */}
      <div
        ref={imageRef}
        className="absolute overflow-hidden"
        style={{ left: '6vw', top: '12vh', width: '52vw', height: '76vh', maxWidth: '700px' }}
      >
        <img
          src={image}
          alt={`${client} Case Study`}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(40%) contrast(1.1)' }}
        />
      </div>

      {/* Vertical Hairline */}
      <div
        ref={hairlineRef}
        className="hairline absolute w-px"
        style={{ left: '60vw', top: '12vh', height: '76vh', transformOrigin: 'top' }}
      />

      {/* Right Text Block */}
      <div
        ref={textRef}
        className="absolute"
        style={{ left: '62vw', top: '12vh', width: '32vw', maxWidth: '400px' }}
      >
        <span className="micro-label text-accent block mb-4">Case</span>

        <h3 className="headline-lg text-venture-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          {client}
        </h3>

        <p className="text-venture-white text-lg md:text-xl font-medium mb-4 leading-snug">
          {headline}
        </p>

        <p className="text-venture-gray text-base leading-relaxed mb-8">
          {body}
        </p>

        <a
          ref={ctaRef}
          href={link}
          target={link.startsWith('http') ? '_blank' : undefined}
          rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors group"
        >
          <span className="text-sm font-medium">Ler o case completo</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
