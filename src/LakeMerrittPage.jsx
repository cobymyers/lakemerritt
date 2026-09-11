/**
 * Lake Merritt: The Living Necklace
 *
 * A React/Next.js landing page with Day/Night mode toggle.
 *
 * ─── Setup (if starting fresh) ───────────────────────────────────────────────
 *  npx create-next-app@latest lake-merritt --tailwind --app --js
 *  npm install lucide-react
 *
 *  tailwind.config.js → set:  darkMode: 'class'
 *
 *  Then copy this file to app/page.jsx and add 'use client' at the top,
 *  OR use it directly as a React component in any Vite/CRA setup.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sun, Moon, MapPin, Bird, Waves, TreePine, Music, ChevronDown,
} from 'lucide-react';

/* ─── Assets ─────────────────────────────────────────────────────────────── */
const IMG = {
  dayHero:    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1600&auto=format&fit=crop',
  dayFlowers: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop',
  dayPark:    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop',
  nightMoody: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?q=80&w=800&auto=format&fit=crop',
};

/* ─── Map pin data ───────────────────────────────────────────────────────── */
const PINS = [
  {
    id: 1,
    label: 'The Pergola',
    fact: 'The Pergola — Built in 1913, this classical colonnade graces the eastern shore as one of Lake Merritt\'s most photographed landmarks, offering sweeping views across the water to the Oakland skyline.',
    top: '18%', left: '70%',
  },
  {
    id: 2,
    label: 'The Gardens',
    fact: 'The Gardens — Seven acres of themed flora wrap the lake\'s southern edge, including a serene Japanese Bonsai collection, a cacti garden, and an aromatic herb garden tended by volunteers since the 1940s.',
    top: '74%', left: '30%',
  },
  {
    id: 3,
    label: "Children's Fairyland",
    fact: "Children's Fairyland — Opened September 2, 1950 as the world's first theme park designed specifically for young children. Walt Disney visited in 1954 and is widely credited as drawing direct inspiration for Disneyland from what he experienced here.",
    top: '36%', left: '9%',
  },
];

/* ─── Ecology card data ──────────────────────────────────────────────────── */
const CARDS = [
  {
    icon: <Waves size={18} strokeWidth={1.5} />,
    title: 'Tidal Lagoon',
    sub: 'A Living Estuary',
    body: 'Directly connected to San Francisco Bay, Lake Merritt is a rare urban estuary where tidal salt water mingles with fresh water — creating a brackish ecosystem teeming with life in the heart of Oakland.',
  },
  {
    icon: <Bird size={18} strokeWidth={1.5} />,
    title: 'Bird Islands',
    sub: 'Pacific Flyway Sanctuary',
    body: 'Five artificial islands dot the lake\'s surface as protected sanctuaries for migratory birds traveling the Pacific Flyway. Pelicans, cormorants, and great egrets make these islands their seasonal home.',
  },
  {
    icon: <TreePine size={18} strokeWidth={1.5} />,
    title: "Children's Fairyland",
    sub: 'Since 1950',
    body: "Nestled on the lake's northern shore, this beloved storybook park inspired Walt Disney when he visited in 1954 — planting the seeds of imagination that would eventually become Disneyland.",
  },
  {
    icon: <Music size={18} strokeWidth={1.5} />,
    title: 'Vibrant Culture',
    sub: '3.4-Mile Loop',
    body: "Oakland's 3.4-mile perimeter path pulses with life — weekend drum circles, spontaneous salsa dancing, dragon boat races, kayakers, and joggers sharing the path in joyful community celebration.",
  },
];

/* ─── Rotating hero words — blurred swap, à la dolsten.com ──────────────── */
const HERO_WORDS = [
  'The Heart of Oakland',
  'The Living Necklace',
  'A Tidal Sanctuary',
  'An Urban Estuary',
];

/* ─── Marquee strip content ──────────────────────────────────────────────── */
const MARQUEE =
  'Est. 1870 — First Official Wildlife Refuge — 3.4-Mile Loop — 3,400 Lights — The Living Necklace — Oakland, California — ';

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function LakeMerrittPage() {
  const [isDark, setIsDark] = useState(false);
  const [activePin, setActivePin] = useState(null);
  const [progress, setProgress] = useState(0);        // preloader counter 0→100
  const [loaded, setLoaded] = useState(false);        // counter finished, curtain lifting
  const [loaderGone, setLoaderGone] = useState(false); // curtain done, unmount preloader
  const [wordIdx, setWordIdx] = useState(0);          // rotating hero word
  const [scrollPct, setScrollPct] = useState(0);      // top scroll progress bar

  /* Preloader — eased 0→100 counter over ~1.6s */
  useEffect(() => {
    if (loaded) return;
    let raf; let start;
    const DURATION = 1600;
    const tick = (t) => {
      if (start === undefined) start = t;
      const k = Math.min(1, (t - start) / DURATION);
      setProgress(Math.round(100 * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setLoaded(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded]);

  /* Unmount preloader after the curtain-lift transition finishes */
  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => setLoaderGone(true), 950);
    return () => clearTimeout(id);
  }, [loaded]);

  /* Lock scroll while the preloader is up */
  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [loaded]);

  /* Rotating hero word */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 3200);
    return () => clearInterval(id);
  }, []);

  /* Scroll progress bar */
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = () => {
    setIsDark(d => !d);
    setActivePin(null);
  };

  /* Card images (day). The last card layers IMG.nightMoody on top,
     crossfaded in at night — same src-swap limitation as the hero */
  const cardImgs = [IMG.dayFlowers, IMG.dayHero, IMG.dayPark, IMG.dayPark];

  return (
    /* ── Root: adding `dark` class here activates Tailwind dark: variants ── */
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f2f8f4] dark:bg-[#060c18] text-[#172817] dark:text-white transition-colors duration-700 selection:bg-amber-400/30">

        {/* ════════ PRELOADER — 0→100 counter, then curtain lifts ════════ */}
        {!loaderGone && (
          <div
            aria-hidden={loaded}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center
              bg-[#f2f8f4] transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)]
              ${loaded ? '-translate-y-full' : ''}`}
          >
            <p className="f-mono text-[10px] tracking-[.35em] uppercase text-emerald-700/60 mb-6">
              Lake Merritt · Oakland, CA
            </p>
            <p className="f-mono font-light tabular-nums text-emerald-950"
              style={{ fontSize: 'clamp(3rem,8vw,5.5rem)', lineHeight: 1 }}>
              {progress}%
            </p>
            <div className="w-44 h-px bg-emerald-900/15 mt-8">
              <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ════════ SCROLL PROGRESS BAR ═══════════════════════════════════ */}
        <div className="fixed inset-x-0 top-0 z-[60] h-[3px] pointer-events-none">
          <div
            className={`h-full transition-colors duration-700 ${isDark ? 'bg-amber-400' : 'bg-emerald-500'}`}
            style={{ width: `${scrollPct}%` }}
          />
        </div>

        {/* ════════ HEADER ════════════════════════════════════════════════ */}
        <header className="fixed inset-x-0 top-0 z-50">
          <div className="absolute inset-0 backdrop-blur-md
            bg-[#f2f8f4]/85 dark:bg-[#060c18]/85
            border-b border-sky-200/50 dark:border-amber-500/10
            transition-colors duration-700" />

          <div className="relative f-body max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Wordmark */}
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-amber-400 transition-colors duration-700" />
              <span className="f-mono text-[11px] tracking-[.25em] uppercase font-medium
                text-emerald-700 dark:text-amber-400/80 transition-colors duration-700">
                Lake Merritt
              </span>
            </div>

            {/* Toggle button */}
            <button
              onClick={toggle}
              className="f-mono flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-medium tracking-wide
                transition-all duration-500 cursor-pointer
                bg-sky-100 border border-sky-200/90 text-sky-700 hover:bg-sky-200/70
                dark:bg-amber-500/10 dark:border dark:border-amber-400/30 dark:text-amber-300 dark:hover:bg-amber-500/15"
            >
              {isDark
                ? <Sun size={14} strokeWidth={2} />
                : <Moon size={14} strokeWidth={2} />}
              Toggle Time of Day
            </button>
          </div>
        </header>

        {/* ════════ HERO ══════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-end overflow-hidden">

          {/* Background — pure CSS motion: shimmering water gradient plus
              concentric shoreline rings drifting on slow counter-rotations
              (organic border-radius makes rotation read as a shoreline) */}
          <div className="absolute inset-0">
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'water-night' : 'water-day'}`}
              style={{ opacity: isDark ? 0.5 : 0.35 }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[
                { w: '58%', h: '38%', dur: 55, rev: false, dashed: true,  a: isDark ? 0.30 : 0.40 },
                { w: '78%', h: '52%', dur: 75, rev: true,  dashed: false, a: isDark ? 0.20 : 0.28 },
                { w: '98%', h: '66%', dur: 95, rev: false, dashed: false, a: isDark ? 0.12 : 0.18 },
              ].map((r, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: r.w,
                    height: r.h,
                    borderRadius: '60% 40% 52% 48% / 46% 52% 48% 54%',
                    border: `1.5px ${r.dashed ? 'dashed' : 'solid'} ${
                      isDark ? `rgba(251,191,36,${r.a})` : `rgba(2,132,199,${r.a})`
                    }`,
                    animation: `spin-slow ${r.dur}s linear infinite${r.rev ? ' reverse' : ''}`,
                  }}
                />
              ))}
            </div>
            <div className={`absolute inset-0 transition-all duration-1000 ${
              isDark
                ? 'bg-gradient-to-t from-[#060c18] via-[#060c18]/55 to-[#060c18]/15'
                : 'bg-gradient-to-t from-[#f2f8f4] via-[#f2f8f4]/30 to-transparent'
            }`} />
          </div>

          {/* Hero text + right-hand stats */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-28 pt-36 w-full flex items-end justify-between gap-12">

            {/* Left column */}
            <div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full
              text-[11px] tracking-[.22em] uppercase font-medium f-mono transition-all duration-700 ${
              isDark
                ? 'bg-amber-400/10 border border-amber-400/25 text-amber-300'
                : 'bg-white/55 border border-emerald-200/80 text-emerald-700 backdrop-blur-sm'
            }`}>
              <Bird size={11} strokeWidth={2.5} />
              Est. 1870 · Oakland, California
            </div>

            {/* Headline */}
            <h1 className="f-display font-light leading-none mb-6 transition-colors duration-700"
              style={{ fontSize: 'clamp(4.5rem,11vw,9.5rem)' }}>
              <span className="block italic">Lake</span>
              <span className={`block font-semibold tracking-tight transition-colors duration-700 ${
                isDark ? 'text-amber-300' : 'text-sky-600'
              }`}
                style={{ textShadow: isDark ? '0 0 40px rgba(251,191,36,.4)' : 'none' }}>
                Merritt
              </span>
            </h1>

            {/* Rotating sub — blurred word swap, keyed remount replays the animation */}
            <p className="f-display text-2xl italic font-light mb-3 h-8 text-slate-600 dark:text-white/70 transition-colors duration-700">
              <span key={wordIdx} className="blur-in inline-block">{HERO_WORDS[wordIdx]}</span>
            </p>
            <p className={`f-body text-xs tracking-[.18em] uppercase transition-colors duration-700 ${
              isDark ? 'text-amber-400/50' : 'text-slate-400'
            }`}>
              The United States&apos; First Official Wildlife Refuge (Est. 1870)
            </p>

            {/* Scroll cue */}
            <div className={`mt-14 transition-colors duration-700 ${isDark ? 'text-amber-400/30' : 'text-slate-300'}`}>
              <ChevronDown size={22} className="float" />
            </div>

            </div>{/* /Left column */}

            {/* Right-hand stats — fills the hero's dead space on wide screens */}
            <div className="hidden lg:flex flex-col items-end gap-6 f-mono text-right pb-1">
              {[
                ['3.4', 'Mile Perimeter Loop'],
                ['3,400', 'Globe Lights'],
                ['5', 'Bird Islands'],
                ['1870', 'Est. Wildlife Refuge'],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className={`f-display text-4xl font-light leading-none transition-colors duration-700 ${
                    isDark ? 'text-amber-300' : 'text-emerald-700'
                  }`}>{num}</p>
                  <p className={`text-[10px] tracking-[.25em] uppercase mt-2 transition-colors duration-700 ${
                    isDark ? 'text-white/35' : 'text-slate-500'
                  }`}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical coordinates along the right edge */}
          <div
            aria-hidden="true"
            className={`hidden xl:block absolute right-7 top-1/2 -translate-y-1/2 z-10 f-mono text-[10px] tracking-[.4em] uppercase transition-colors duration-700 ${
              isDark ? 'text-amber-400/25' : 'text-slate-400'
            }`}
            style={{ writingMode: 'vertical-rl' }}
          >
            37.8044° N · 122.2578° W — Lake Merritt
          </div>

          {/* Necklace light strip along bottom edge (night only) */}
          {isDark && (
            <div className="absolute bottom-0 inset-x-0 flex justify-center gap-[11px] pb-3 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[5px] h-[5px] rounded-full bg-amber-400 a-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    boxShadow: '0 0 7px 2px rgba(251,191,36,.75)',
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* ════════ MARQUEE STRIP ═════════════════════════════════════════ */}
        <div className={`overflow-hidden border-y transition-colors duration-700 ${
          isDark ? 'border-amber-500/10 bg-[#081019]' : 'border-sky-200/50 bg-white/50'
        }`}>
          <div className="marquee-track flex w-max py-3.5">
            {[0, 1].map(copy => (
              <span
                key={copy}
                aria-hidden={copy === 1}
                className={`f-mono text-[10px] tracking-[.35em] uppercase whitespace-nowrap transition-colors duration-700 ${
                  isDark ? 'text-amber-400/40' : 'text-emerald-700/50'
                }`}
              >
                {MARQUEE.repeat(2)}
              </span>
            ))}
          </div>
        </div>

        {/* ════════ HISTORY & ECOLOGY 2×2 GRID ═══════════════════════════ */}
        <section className="py-28 px-6 f-body">
          <div className="max-w-6xl mx-auto">

            {/* Section label */}
            <div className="text-center mb-16">
              <span className={`f-mono text-[11px] tracking-[.3em] uppercase font-medium transition-colors duration-700 ${
                isDark ? 'text-amber-400/55' : 'text-emerald-600/70'
              }`}>01 — Discover</span>
              <h2 className="f-display text-5xl md:text-[3.75rem] font-light mt-2 transition-colors duration-700">
                The Living <em>Necklace</em>
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CARDS.map((card, idx) => (
                <div
                  key={idx}
                  className={`card-lift group relative overflow-hidden rounded-2xl cursor-default
                    transition-all duration-700 ${
                    isDark
                      ? 'bg-[#0c1829] necklace'
                      : 'bg-white border border-sky-100/90 shadow-sm shadow-sky-100/50'
                  }`}
                >
                  {/* Image — pixel-grid tile reveal on scroll into view */}
                  <PixelReveal dark={isDark}>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={cardImgs[idx]}
                      alt={card.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
                      style={{
                        filter: isDark ? 'brightness(.6) saturate(.75)' : 'brightness(.95)',
                      }}
                    />
                    {idx === cardImgs.length - 1 && (
                      <img
                        src={IMG.nightMoody}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:scale-[1.04]"
                        style={{
                          filter: 'brightness(.6) saturate(.75)',
                          opacity: isDark ? 1 : 0,
                        }}
                      />
                    )}
                  </div>
                  </PixelReveal>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`transition-colors duration-700 ${isDark ? 'text-amber-400' : 'text-emerald-500'}`}>
                        {card.icon}
                      </span>
                      <div>
                        <h3 className="f-display text-2xl font-light">{card.title}</h3>
                        <p className={`f-mono text-[10px] tracking-[.22em] uppercase font-medium transition-colors duration-700 ${
                          isDark ? 'text-amber-400/50' : 'text-emerald-600/60'
                        }`}>{card.sub}</p>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed transition-colors duration-700 ${
                      isDark ? 'text-white/55' : 'text-slate-500'
                    }`}>{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ INTERACTIVE MAP ═══════════════════════════════════════ */}
        <section className="py-24 px-6 f-body">
          <div className="max-w-4xl mx-auto">

            {/* Label */}
            <div className="text-center mb-12">
              <span className={`f-mono text-[11px] tracking-[.3em] uppercase font-medium transition-colors duration-700 ${
                isDark ? 'text-amber-400/55' : 'text-emerald-600/70'
              }`}>02 — Explore</span>
              <h2 className="f-display text-5xl md:text-[3.75rem] font-light mt-2 transition-colors duration-700">
                The 3.4-Mile <em>Loop</em>
              </h2>
              <p className={`mt-3 text-sm transition-colors duration-700 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
                Click a pin to discover a landmark
              </p>
            </div>

            {/* Map canvas */}
            <div className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
              isDark ? 'necklace bg-[#07101f]' : 'bg-sky-50/70 border border-sky-200/60'
            }`} style={{ height: 460 }}>

              {/* Ambient radial blobs */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 35% 65%, rgba(14,40,80,.85) 0%,transparent 55%), radial-gradient(ellipse at 68% 32%, rgba(18,32,64,.7) 0%,transparent 50%)'
                  : 'radial-gradient(ellipse at 35% 65%, rgba(186,230,253,.5) 0%,transparent 55%), radial-gradient(ellipse at 68% 32%, rgba(167,243,208,.4) 0%,transparent 50%)',
              }} />

              {/* Foliage dots — day mode */}
              {!isDark && [
                {t:'8%',l:'18%',s:9},{t:'7%',l:'52%',s:7},{t:'9%',l:'80%',s:10},
                {t:'84%',l:'12%',s:8},{t:'86%',l:'60%',s:7},{t:'83%',l:'86%',s:9},
              ].map((d,i) => (
                <div key={i} className="absolute rounded-full bg-emerald-300/50 pointer-events-none"
                  style={{ top:d.t, left:d.l, width:d.s*2.2, height:d.s*2.2, filter:'blur(1.5px)' }} />
              ))}

              {/* Dashed perimeter path */}
              <div className="absolute pointer-events-none" style={{
                top:'50%', left:'50%',
                transform:'translate(-50%,-50%)',
                width:'82%', height:'72%',
                borderRadius:'58% 42% 50% 50% / 44% 50% 50% 56%',
                border: isDark
                  ? '1.5px dashed rgba(251,191,36,.18)'
                  : '1.5px dashed rgba(134,197,130,.55)',
              }} />

              {/* Lake body */}
              <div
                className={`absolute pointer-events-none transition-all duration-700 ${
                  isDark ? 'water-night' : 'water-day'
                }`}
                style={{
                  top:'50%', left:'50%',
                  transform:'translate(-50%,-50%)',
                  width:'67%', height:'60%',
                  borderRadius:'60% 40% 52% 48% / 46% 52% 48% 54%',
                }}
              >
                {/* Horizontal reflection lines */}
                <div className="absolute inset-0 water-stripes pointer-events-none"
                  style={{ borderRadius:'inherit', opacity:.22 }} />

                {/* Bird islands */}
                {[[28,33,17,11],[54,58,22,14],[70,36,18,12]].map(([t,l,w,h],i) => (
                  <div key={i}
                    className={`absolute rounded-full transition-colors duration-700 ${
                      isDark ? 'bg-[#19395e]' : 'bg-emerald-200'
                    }`}
                    style={{ top:`${t}%`, left:`${l}%`, width:w, height:h }}
                  />
                ))}
              </div>

              {/* ── Map Pins ── */}
              {PINS.map(pin => (
                <button
                  key={pin.id}
                  onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                  className="absolute z-10 flex flex-col items-center focus:outline-none cursor-pointer"
                  style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -100%)' }}
                >
                  {/* Floating label */}
                  <span className={`f-mono mb-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap
                    transition-all duration-250 ${
                      activePin === pin.id
                        ? isDark
                          ? 'opacity-100 bg-amber-400 text-black'
                          : 'opacity-100 bg-emerald-600 text-white'
                        : 'opacity-0 scale-95'
                    }`}>
                    {pin.label}
                  </span>

                  {/* Icon */}
                  <MapPin
                    size={30}
                    strokeWidth={1.5}
                    fill={activePin === pin.id ? 'currentColor' : 'none'}
                    className={`pin-icon drop-shadow-lg transition-all duration-300 ${
                      activePin === pin.id
                        ? isDark
                          ? 'text-amber-400 a-pulse'
                          : 'text-emerald-600'
                        : isDark
                          ? 'text-amber-300/50'
                          : 'text-emerald-500/65'
                    }`}
                  />
                </button>
              ))}

              {/* Map ornaments */}
              <div className={`f-mono absolute bottom-4 right-5 text-[10px] tracking-widest uppercase
                transition-colors duration-700 ${isDark ? 'text-amber-400/22' : 'text-slate-300'}`}>
                N ↑
              </div>
              <div className="absolute bottom-4 left-5 flex items-center gap-2">
                <div className={`h-px w-10 transition-colors duration-700 ${isDark ? 'bg-amber-400/20' : 'bg-slate-200'}`} />
                <span className={`f-mono text-[9px] uppercase tracking-wider transition-colors duration-700 ${
                  isDark ? 'text-amber-400/22' : 'text-slate-300'}`}>
                  0.5 mi
                </span>
              </div>
            </div>

            {/* Fact panel — animated slide open */}
            <div style={{
              maxHeight: activePin !== null ? 220 : 0,
              opacity:   activePin !== null ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height .5s cubic-bezier(.4,0,.2,1), opacity .4s ease',
            }}>
              {activePin !== null && (
                <div className={`mt-5 p-6 rounded-2xl fade-up transition-all duration-700 ${
                  isDark
                    ? 'bg-[#0c1829] border border-amber-400/15'
                    : 'bg-white border border-sky-100 shadow-sm'
                }`}>
                  <div className="flex gap-4 items-start">
                    <MapPin
                      size={17}
                      strokeWidth={1.5}
                      fill="currentColor"
                      className={`mt-0.5 flex-shrink-0 transition-colors duration-700 ${
                        isDark ? 'text-amber-400' : 'text-emerald-500'
                      }`}
                    />
                    <p className={`text-sm leading-relaxed transition-colors duration-700 ${
                      isDark ? 'text-white/65' : 'text-slate-600'
                    }`}>
                      {PINS.find(p => p.id === activePin)?.fact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════ THE NECKLACE — feature callout ════════════════════════ */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div
              className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
                isDark ? 'necklace' : 'border border-sky-100 shadow-sm'
              }`}
              style={{
                background: isDark
                  ? 'linear-gradient(135deg,#080f1e 0%,#0d1e3a 50%,#080f1e 100%)'
                  : 'linear-gradient(135deg,#eef7f1 0%,#e8f4fb 50%,#eef7f1 100%)',
              }}
            >
              {/* Necklace dots — top row */}
              <div className="absolute top-0 inset-x-0 flex justify-around pt-2.5 pointer-events-none">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[5px] h-[5px] rounded-full transition-colors duration-700 ${
                      isDark ? 'bg-amber-400 a-pulse' : 'bg-emerald-400/50'
                    }`}
                    style={{
                      animationDelay: `${i * 0.07}s`,
                      boxShadow: isDark ? '0 0 6px 2px rgba(251,191,36,.65)' : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Necklace dots — bottom row */}
              <div className="absolute bottom-0 inset-x-0 flex justify-around pb-2.5 pointer-events-none">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[5px] h-[5px] rounded-full transition-colors duration-700 ${
                      isDark ? 'bg-amber-400 a-pulse' : 'bg-emerald-400/50'
                    }`}
                    style={{
                      animationDelay: `${(i * 0.07) + 0.85}s`,
                      boxShadow: isDark ? '0 0 6px 2px rgba(251,191,36,.65)' : 'none',
                    }}
                  />
                ))}
              </div>

              <div className="px-10 py-16 text-center f-body">
                <span className={`f-mono text-[11px] tracking-[.3em] uppercase font-medium mb-4 block transition-colors duration-700 ${
                  isDark ? 'text-amber-400/55' : 'text-emerald-600/70'
                }`}>
                  03 — The Necklace
                </span>

                <h2 className={`f-display font-light mb-5 transition-all duration-700 ${
                  isDark ? 'text-white' : 'text-[#172817]'
                }`}
                  style={{
                    fontSize: 'clamp(2.6rem,6vw,3.8rem)',
                    textShadow: isDark ? '0 0 35px rgba(251,191,36,.35)' : 'none',
                  }}>
                  <em>3,400 Lights</em><br />Around the Lake
                </h2>

                <p className={`max-w-2xl mx-auto text-base leading-relaxed font-light transition-colors duration-700 ${
                  isDark ? 'text-white/55' : 'text-slate-500'
                }`}>
                  Each evening, Lake Merritt is ringed by 3,400 globe lights illuminating
                  the entire 3.4-mile perimeter — a beloved Oakland landmark and the origin
                  of the lake&apos;s poetic name,{' '}
                  <em className={isDark ? 'text-amber-300/85' : 'text-emerald-600'}>
                    The Living Necklace
                  </em>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FOOTER ════════════════════════════════════════════════ */}
        <footer className={`mt-8 py-12 px-6 border-t f-body transition-all duration-700 ${
          isDark
            ? 'border-amber-500/8 bg-[#040a12]'
            : 'border-sky-100 bg-[#e6f2ea]'
        }`}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="f-display text-2xl font-light">Lake <em>Merritt</em></p>
              <p className={`f-mono text-[10px] tracking-[.25em] uppercase mt-1 transition-colors duration-700 ${
                isDark ? 'text-amber-400/50' : 'text-slate-500'
              }`}>
                Oakland, California · Est. 1870
              </p>
            </div>
            <p className={`f-mono text-xs text-center md:text-right transition-colors duration-700 ${
              isDark ? 'text-white/40' : 'text-slate-600'
            }`}>
              The United States&apos; First Official Wildlife Refuge
              <br />
              <span className={isDark ? 'text-amber-400/50' : 'text-slate-500'}>
                The Living Necklace
              </span>
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

/* ─── Pixel-grid reveal — 10×5 tiles fade out in random order when the
       element scrolls into view (dolsten.com-style image reveal) ────────── */
function PixelReveal({ dark, children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  /* Deterministic pseudo-random delays — Math.random() here would render
     differently on server vs client and trigger hydration mismatches */
  const delays = useMemo(
    () => Array.from({ length: 50 }, (_, i) => (i * 137 + 59) % 650),
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-10 grid-rows-5 pointer-events-none"
      >
        {delays.map((d, i) => (
          <div
            key={i}
            className={`transition-opacity duration-500 ${dark ? 'bg-[#0c1829]' : 'bg-white'}`}
            style={{ opacity: shown ? 0 : 1, transitionDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
