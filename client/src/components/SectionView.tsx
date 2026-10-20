import { useCallback, useEffect, useRef, useState } from 'react';
import type { Entry } from '@/data/content';
import { identity, services } from '@/data/content';

interface SectionViewProps {
  label: string;
  blurb: string;
  entries: Entry[];
  /** Which panel closes the section: a pointer to services, or (in services itself) a nudge to get in touch. */
  closing?: 'services' | 'contact';
  onBack: () => void;
  onButtonHover: (el: Element | null) => void;
  onButtonClick: (el: Element) => void;
}

const panelClass =
  'snap-center shrink-0 w-full sm:w-[26rem] md:w-[30rem] flex flex-col ' +
  'px-6 py-10 sm:px-0 sm:py-4 sm:max-h-full sm:overflow-y-auto hide-scrollbar';
const panelInner = 'my-auto w-full';

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className={`space-y-3 ${entry.current ? 'border-l-2 border-cyan-400/70 pl-5' : ''}`}>
      {(entry.period || entry.current) && (
        <div className="flex items-baseline gap-3 text-xs text-cyan-400 tracking-wider">
          {entry.period && <span>{entry.period}</span>}
          {entry.current && <span className="text-cyan-200/80">now</span>}
        </div>
      )}
      <h3 className="text-xl sm:text-2xl text-slate-100 font-bold leading-snug">{entry.title}</h3>
      {entry.subtitle && <p className="text-sm text-slate-300">{entry.subtitle}</p>}
      <p className="text-sm text-slate-300 leading-relaxed">{entry.description}</p>
      {entry.highlights && (
        <ul className="space-y-1.5 pt-1">
          {entry.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-[13px] text-slate-300 leading-relaxed">
              <span className="text-cyan-400/80 shrink-0">~</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.stats && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          {entry.stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="text-lg text-cyan-400 font-bold">{s.value}</span>
              <span className="text-sm text-slate-300">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {entry.tags && (
        <div className="flex flex-wrap gap-2 pt-1">
          {entry.tags.map((t) => (
            <span key={t} className="text-xs text-slate-400 bg-slate-800/60 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
      )}
      {entry.link && (
        <a
          href={entry.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-4"
        >
          {entry.link.label}
        </a>
      )}
    </article>
  );
}

export function ServicesPanel() {
  return (
    <div className="space-y-5">
      <h3 className="text-xl sm:text-2xl text-slate-100 font-bold">What I can do for you</h3>
      <ul className="space-y-2">
        {services.map((s) => (
          <li key={s.title} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
            <span className="text-cyan-400/80 shrink-0">~</span>
            <span>{s.title}</span>
          </li>
        ))}
      </ul>
      <a
        href="#services"
        className="inline-block text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-4"
      >
        see all services
      </a>
    </div>
  );
}

function ContactPrompt() {
  return (
    <div className="space-y-3">
      <h3 className="text-xl sm:text-2xl text-slate-100 font-bold">Let&rsquo;s work together</h3>
      <p className="text-sm text-slate-300 leading-relaxed">
        Tell me where your content business is stuck and I&rsquo;ll tell you how I&rsquo;d fix it.
      </p>
    </div>
  );
}

export function ContactLinks({ compact = false }: { compact?: boolean }) {
  const items = [
    { href: `mailto:${identity.email}`, glyph: '✉', label: 'Email', detail: identity.email, external: false },
    { href: `tel:${identity.phone}`, glyph: '☎', label: 'Phone', detail: identity.phoneDisplay, external: false },
    { href: identity.linkedin, glyph: 'in', label: 'LinkedIn', detail: 'kabir-bedii', external: true },
    { href: identity.github, glyph: '⌘', label: 'GitHub', detail: 'KabirBediCareer', external: true },
  ];
  return (
    <div className={compact ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md'}>
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target={it.external ? '_blank' : undefined}
          rel={it.external ? 'noopener noreferrer' : undefined}
          className="group flex items-center gap-4 border border-slate-600/50 bg-slate-900/30 px-4 py-3
                     hover:border-cyan-400/70 hover:bg-slate-800/40 transition-colors duration-300
                     focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
        >
          <span className="w-8 text-center text-xl text-slate-200 font-bold shrink-0">{it.glyph}</span>
          <span className="min-w-0">
            <span className="block text-xs text-slate-400">{it.label}</span>
            {!compact && (
              <span className="block text-sm text-slate-200 truncate group-hover:text-cyan-200 transition-colors">
                {it.detail}
              </span>
            )}
          </span>
        </a>
      ))}
    </div>
  );
}

export default function SectionView({ label, blurb, entries, closing = 'services', onBack, onButtonHover, onButtonClick }: SectionViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const targetRef = useRef(0); // where the last navigation was heading, so fast key presses chain correctly
  const navUntilRef = useRef(0); // while a smooth scroll is in flight, scroll events must not reset the target
  const total = entries.length + 1; // entries + closing panel

  const panels = useCallback(
    () => Array.from(scrollerRef.current?.querySelectorAll<HTMLElement>('[data-panel]') ?? []),
    [],
  );

  const isHorizontal = () => window.matchMedia('(min-width: 640px)').matches;

  const goTo = useCallback(
    (i: number) => {
      const list = panels();
      const clamped = Math.max(0, Math.min(list.length - 1, i));
      targetRef.current = clamped;
      navUntilRef.current = Date.now() + 700;
      list[clamped]?.scrollIntoView({
        behavior: 'smooth',
        block: isHorizontal() ? 'nearest' : 'start',
        inline: 'center',
      });
    },
    [panels],
  );

  // Track which panel is closest to the centre of the viewport.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const list = panels();
      const horizontal = isHorizontal();
      const mid = horizontal ? window.innerWidth / 2 : window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      list.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        const centre = horizontal ? r.left + r.width / 2 : r.top + r.height / 2;
        const d = Math.abs(centre - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
      if (Date.now() > navUntilRef.current) targetRef.current = best;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [panels]);

  // Keyboard: arrows move between panels, Escape goes home.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goTo(targetRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(targetRef.current - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, onBack]);

  // Translate vertical wheel into horizontal travel on desktop, so a mouse wheel works too.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!isHorizontal()) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const navButton =
    'px-3 py-2 text-xs text-slate-300 border border-slate-600/50 bg-slate-900/40 backdrop-blur-sm ' +
    'hover:text-cyan-200 hover:border-cyan-400/70 transition-colors duration-300 ' +
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 disabled:opacity-30 disabled:pointer-events-none';

  return (
    <div className="fixed inset-0 z-20 flex flex-col animate-fadeIn" role="region" aria-label={label}>
      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3 sm:py-4">
        <button
          type="button"
          onClick={(e) => {
            onButtonClick(e.currentTarget);
            onBack();
          }}
          onMouseEnter={(e) => onButtonHover(e.currentTarget)}
          onMouseLeave={() => onButtonHover(null)}
          className={navButton}
          data-testid="button-back"
        >
          ← back
        </button>
        <div className="text-center min-w-0">
          <div className="text-sm text-slate-100 font-bold">{label}</div>
          <div className="hidden sm:block text-xs text-slate-400 truncate">{blurb}</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 tabular-nums w-14 text-right" aria-live="polite">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            onMouseEnter={(e) => onButtonHover(e.currentTarget)}
            onMouseLeave={() => onButtonHover(null)}
            disabled={index === 0}
            className={navButton}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            onMouseEnter={(e) => onButtonHover(e.currentTarget)}
            onMouseLeave={() => onButtonHover(null)}
            disabled={index === total - 1}
            className={navButton}
            aria-label="Next"
          >
            →
          </button>
        </div>
        <div className="sm:hidden w-16" />
      </header>

      {/* Panels */}
      <div
        ref={scrollerRef}
        className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden mb-40 sm:mb-0
                   sm:flex-row sm:items-center sm:overflow-x-auto sm:overflow-y-hidden sm:snap-x sm:snap-mandatory
                   sm:gap-16 md:gap-28 sm:px-[calc(50vw-13rem)] md:px-[calc(50vw-15rem)] sm:pb-40 hide-scrollbar"
      >
        {entries.map((entry, i) => (
          <section key={entry.title + i} data-panel className={panelClass}>
            <div className={panelInner}>
              <EntryCard entry={entry} />
            </div>
          </section>
        ))}
        <section data-panel className={panelClass}>
          <div className={panelInner}>
            {closing === 'services' ? <ServicesPanel /> : <ContactPrompt />}
            <a
              href="#contact"
              className="inline-block mt-6 text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-4"
            >
              get in touch
            </a>
          </div>
        </section>
      </div>

    </div>
  );
}

