import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Serviços', href: '#capabilities' },
  { label: 'Cases', href: '#cases' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contato', href: '#contact' },
];

const pinnedSectionOffsets: Record<string, number> = {
  capabilities: 0.22,
  cases: 0.22,
};

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);

    if (!target) {
      setIsMenuOpen(false);
      return;
    }

    event.preventDefault();

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offsetProgress = pinnedSectionOffsets[targetId] ?? 0;
    const scrollTarget = Math.max(0, targetTop + window.innerHeight * offsetProgress);

    window.history.replaceState(null, '', href);
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled
            ? 'bg-venture-black/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
          }`}
      >
        <div className="px-[6vw] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img
              src="/logo-250x60.png"
              alt="Venture"
              className="h-10 md:h-12 object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleNavClick(link.href)}
                className="text-venture-gray hover:text-venture-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 text-venture-white hover:text-accent transition-colors"
          >
            <span className="text-sm font-medium hidden md:inline">Menu</span>
            <div className="relative w-6 h-6">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </div>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div
        className={`fixed inset-0 z-[999] bg-venture-black transition-all duration-500 ${isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="h-full flex flex-col justify-center items-center">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleNavClick(link.href)}
              className={`headline-lg text-venture-white hover:text-accent transition-all duration-300 py-4 ${isMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}
              style={{
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
