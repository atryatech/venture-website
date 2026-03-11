import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PenTool, Rocket, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'EXPERIÊNCIA',
    description: 'Experiência prática nos mais diversos segmentos e equipes multidisciplinares.',
    icon: Search,
  },
  {
    number: '02',
    title: 'INOVAÇÃO',
    description: 'Lógica "Fazer mais com Menos" com inovações tecnológicas rápidas e baixo custo.',
    icon: PenTool,
  },
  {
    number: '03',
    title: 'INTEGRAÇÃO',
    description: 'Sua estratégia integrada aos processos com Inteligência Artificial.',
    icon: Rocket,
  },
  {
    number: '04',
    title: 'TECNOLOGIA',
    description: 'Agregamos a Gestão de Riscos e Tecnologia aos seus ambientes de negócio.',
    icon: TrendingUp,
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

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
        { y: '-40vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Horizontal line
      scrollTl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none' },
        0.1
      );

      // Step cards (staggered)
      cardsRef.current.forEach((card, i) => {
        if (card) {
          scrollTl.fromTo(
            card,
            { y: '80vh', opacity: 0, rotateZ: -2 },
            { y: 0, opacity: 1, rotateZ: 0, ease: 'none' },
            0.12 + i * 0.07
          );
        }
      });

      // Step numbers
      numbersRef.current.forEach((num, i) => {
        if (num) {
          scrollTl.fromTo(
            num,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, ease: 'none' },
            0.18 + i * 0.05
          );
        }
      });

      // SETTLE (30% - 70%) - hold

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
        { y: 0, opacity: 1 },
        { y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        lineRef.current,
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
      className="section-pinned bg-venture-black z-40"
    >
      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute"
        style={{ left: '6vw', top: '14vh', width: '70vw' }}
      >
        <h2 className="headline-lg text-venture-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
          <span className="block">Por que a</span>
          <span className="block">
            Ventu<span className="text-accent">re</span>
          </span>
        </h2>
      </div>

      {/* Horizontal Line */}
      <div
        ref={lineRef}
        className="hairline absolute h-px"
        style={{ left: '6vw', top: '58vh', width: '88vw', transformOrigin: 'left' }}
      />

      {/* Timeline Cards */}
      {steps.map((step, index) => {
        const Icon = step.icon;
        const leftPos = 6 + index * 22;

        return (
          <div
            key={step.number}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="absolute flex flex-col"
            style={{
              left: `${leftPos}vw`,
              top: '48vh',
              width: '18vw',
              height: '42vh',
              maxWidth: '240px',
            }}
          >
            {/* Step Number */}
            <span
              ref={(el) => { numbersRef.current[index] = el; }}
              className="font-mono text-accent text-2xl md:text-3xl font-bold mb-4"
            >
              {step.number}
            </span>

            {/* Icon */}
            <div className="mb-4">
              <Icon className="w-6 h-6 text-venture-gray" />
            </div>

            {/* Title */}
            <h4 className="text-venture-white font-display font-bold text-sm md:text-base uppercase tracking-tight mb-3">
              {step.title}
            </h4>

            {/* Description */}
            <p className="text-venture-gray text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}
