import React from 'react';
import { Menu, X, ArrowUpRight, Lock } from 'lucide-react';

export default function PortfolioNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('hero');

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Journey', href: '#journey' },
    { label: 'Thinking', href: '#thinking' },
    { label: 'Contact', href: '#contact' },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['about', 'work', 'experience', 'skills', 'journey', 'thinking', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06090e]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Identity */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group text-left focus-visible:outline-cyan-400"
          aria-label="Jatin Singh — Back to top"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors shadow-sm">
            <Lock size={15} />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-wider text-slate-100 group-hover:text-white transition-colors">
              JATIN SINGH
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
              Cyber Strategy & Engineering
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-white/5 rounded-full px-3 py-1 backdrop-blur-sm" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Links */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/jatinsingh82"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} className="text-slate-500" />
          </a>
          <a
            href="#contact"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm shadow-cyan-950"
          >
            <span>Get in Touch</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#06090e]/98 border-b border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://github.com/jatinsingh82"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-semibold text-slate-300 bg-slate-900 border border-slate-800"
            >
              <span>GitHub Profile</span>
              <ArrowUpRight size={14} />
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-cyan-400"
            >
              <span>Initiate Contact</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
