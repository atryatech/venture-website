import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Instagram } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { getHomeSectionHref, homeSectionLinks, scrollToHomeSection } from '@/lib/site-navigation';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Wordmark
      gsap.fromTo(
        wordmarkRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Links
      gsap.fromTo(
        linksRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: linksRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.1,
        }
      );

      // Bottom
      gsap.fromTo(
        bottomRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bottomRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.2,
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSectionClick = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) {
      return;
    }

    event.preventDefault();
    scrollToHomeSection(sectionId);
  };

  return (
    <footer
      ref={sectionRef}
      className="relative bg-venture-black z-[100] py-12 md:py-16"
    >
      <div className="px-[6vw]">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Wordmark */}
          <div ref={wordmarkRef}>
            <span className="font-display font-bold text-venture-white text-4xl md:text-5xl tracking-tight">
              VENTURE
            </span>
            <p className="text-venture-gray text-sm mt-2">
              Consultoria em Gestão de Processos e Gestão de Riscos
            </p>
          </div>

          {/* Navigation Links */}
          <div ref={linksRef} className="flex flex-wrap gap-6 md:gap-8">
            {homeSectionLinks.map((link) => (
              <Link
                key={link.label}
                to={getHomeSectionHref(link.sectionId)}
                onClick={handleSectionClick(link.sectionId)}
                className="text-venture-gray hover:text-venture-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hairline h-px w-full mb-8" />

        {/* Bottom Row */}
        <div
          ref={bottomRef}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-venture-gray text-xs">
            © 2026 Venture Consultoria. Todos os direitos reservados.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-venture-gray hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-venture-gray hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
