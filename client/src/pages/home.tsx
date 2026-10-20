import { useCallback, useEffect, useRef, useState } from 'react';
import FluidCanvas, { centreOf, type FluidHandle } from '@/components/FluidCanvas';
import SectionView, { ContactLinks } from '@/components/SectionView';
import { identity, sections, bio, services, experience, personal, type SectionId } from '@/data/content';

type Active = SectionId | 'none';

const sectionIds = sections.map((s) => s.id);

function readHash(): Active {
  const h = window.location.hash.replace('#', '') as SectionId;
  return sectionIds.includes(h) ? h : 'none';
}

export default function Home() {
  const [active, setActive] = useState<Active>(() => (typeof window === 'undefined' ? 'none' : readHash()));
  const fluid = useRef<FluidHandle>(null);

  // Sections live in the URL hash so refresh and the browser back button both work.
  useEffect(() => {
    const onHash = () => setActive(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = useCallback((id: SectionId) => {
    window.location.hash = id;
  }, []);

  const goHome = useCallback(() => {
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setActive('none');
  }, []);

  useEffect(() => {
    if (active !== 'contact') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && goHome();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goHome]);

  const hover = useCallback((el: Element | null) => {
    fluid.current?.attract(el ? centreOf(el) : null);
  }, []);

  const click = useCallback((el: Element) => {
    fluid.current?.ripple(centreOf(el));
    fluid.current?.attract(null);
  }, []);

  const entriesFor: Record<SectionId, typeof experience> = {
    services: [bio, ...services],
    experience,
    personal,
    contact: [],
  };

  const current = sections.find((s) => s.id === active);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 font-mono">
      <FluidCanvas ref={fluid} />

      {/* Landing */}
      <main
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12
                    transition-all duration-700 ${active !== 'none' ? '-translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
        aria-hidden={active !== 'none'}
      >
        <div className="text-center max-w-xl mx-auto space-y-5 sm:space-y-6 mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-slate-100 font-bold tracking-wide">
            {identity.name}
          </h1>
          <div className="space-y-1">
            <p className="text-base sm:text-lg text-cyan-200/90">{identity.role}</p>
            <p className="text-sm sm:text-[15px] text-slate-300">{identity.education}</p>
          </div>
          <blockquote className="pt-2">
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic">{identity.quote.text}</p>
            <cite className="block mt-1.5 text-xs text-slate-500 not-italic">— {identity.quote.author}</cite>
          </blockquote>
        </div>

        <nav className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm" aria-label="Sections">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              data-testid={`button-${s.id}`}
              onMouseEnter={(e) => hover(e.currentTarget)}
              onMouseLeave={() => hover(null)}
              onClick={(e) => {
                click(e.currentTarget);
                window.setTimeout(() => open(s.id), 150);
              }}
              className="group relative px-4 py-3 sm:py-3.5 bg-slate-800/50 border border-slate-600/50 backdrop-blur-sm text-left
                         hover:bg-slate-700/60 hover:border-slate-500/70 transition-all duration-300
                         focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:border-cyan-400
                         active:scale-95 active:bg-slate-600/70 transform"
            >
              <span className="block text-sm text-slate-200 group-hover:text-cyan-200 transition-colors duration-300">
                {s.label}
              </span>
              <span className="block mt-0.5 text-[11px] text-slate-400 leading-snug">{s.blurb}</span>
            </button>
          ))}
        </nav>

      </main>

      {/* Timeline sections */}
      {current && current.id !== 'contact' && (
        <SectionView
          key={current.id}
          label={current.label}
          blurb={current.blurb}
          entries={entriesFor[current.id]}
          closing={current.id === 'services' ? 'contact' : 'services'}
          onBack={goHome}
          onButtonHover={hover}
          onButtonClick={click}
        />
      )}

      {/* Contact */}
      {active === 'contact' && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6 animate-fadeIn">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl text-slate-100 font-bold">Get in touch</h2>
              <p className="text-sm text-slate-300">
                Based in {identity.location}. Email is the fastest way to reach me.
              </p>
            </div>
            <ContactLinks />
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={(e) => {
                  click(e.currentTarget);
                  goHome();
                }}
                onMouseEnter={(e) => hover(e.currentTarget)}
                onMouseLeave={() => hover(null)}
                className="text-xs text-slate-400 hover:text-cyan-300 transition-colors duration-300
                           focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 px-2 py-1"
                data-testid="button-back-home-contact"
              >
                ← back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
