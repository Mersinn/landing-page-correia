import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState, useEffect, type CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { TrainingMediaStage } from "./TrainingMediaStage";

const WHATSAPP = "https://wa.me/message/K5WYIUI5FXYFE1";

/* Stable local asset paths (no bundler/runtime asset indirection).
 * Drop the real files in /public to replace the controlled fallbacks. */
const HERO_IMAGE = "/matheus-hero.jpg";
const MC_SYMBOL_WHITE = "/mc-symbol-white.svg";

/* Shared visible-focus ring for keyboard users — brandpack colours only */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ice)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--night)] rounded-sm";

const ease = [0.22, 1, 0.36, 1] as const;

/* Shared parallax hook — light motion on mobile + desktop, respects prefers-reduced-motion */
function useParallax(ref: React.RefObject<HTMLElement | null>) {
  const prefersReduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  /* Image drift — % on desktop, px on mobile (perceptible) kept within the 130%+scale crop so edges never show */
  const y = useTransform(scrollYProgress, [0, 1], isDesktop ? ["-22%", "22%"] : ["52px", "-52px"]);
  /* Frame counter-drift + foreground text — desktop-only effects (gated by `deep` in the view) */
  const frameY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  /* Cinematic breath on the photo — subtler on mobile */
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], isDesktop ? [1.1, 1.0, 1.1] : [1.12, 1.02, 1.12]);
  /* Frame scale — zooms in slightly as it crosses center */
  const frameScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.0, 0.98]);
  /* Horizontal wipe line that travels across the image on scroll */
  const wipeX = useTransform(scrollYProgress, [0, 1], ["-110%", "110%"]);
  /* Caption opacity peaks in the middle */
  const captionOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  return {
    y,
    frameY,
    textY,
    scale,
    frameScale,
    wipeX,
    captionOpacity,
    /* Light parallax (image y + scale) runs on mobile too; heavy depth (frame, wipe,
     * caption fade, text counter-move) stays desktop-only via `isDesktop`. */
    enabled: !prefersReduced,
    isDesktop,
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/* -------------------- MC Mark (real brand symbol) -------------------- */
function MCMark({
  className = "",
  title = "Matheus Correia",
  decorative = false,
}: {
  className?: string;
  title?: string;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  /* If the symbol fails to load, render nothing — no broken image and no
   * text/CSS/font recreation of the mark. The wordmark beside it in the
   * nav and footer keeps the brand legible. */
  if (failed) return null;
  return (
    <img
      src={MC_SYMBOL_WHITE}
      alt={decorative ? "" : title}
      aria-hidden={decorative || undefined}
      className={className}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

/* -------------------- CTA -------------------- */
function Cta({
  variant = "ice",
  children,
  className = "",
}: {
  variant?: "ice" | "outline" | "ghostDark";
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [isPressed, setIsPressed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pressTimer = useRef<number | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      if (pressTimer.current) window.clearTimeout(pressTimer.current);
    };
  }, []);
  /* Touch devices have no hover, so press state drives the same expansion desktop gets from
   * `group-hover`. The short 180ms hold lets the inversion register even on a quick tap. */
  const pressOn = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressed(true);
  };
  const pressOff = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => setIsPressed(false), 180);
  };
  const base =
    "group relative inline-flex min-h-[54px] md:min-h-[56px] items-center justify-center overflow-hidden rounded-full pl-6 md:pl-8 pr-14 md:pr-16 text-[11px] md:text-[13px] font-display font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase whitespace-nowrap leading-none";
  /* Each variant defines the resting colours, the lateral panel that expands on hover/press,
   * and the colour of the label that re-appears once the panel has filled the button. */
  const v: Record<string, { root: string; panel: string; fill: string }> = {
    ice: {
      root: "bg-[var(--ice)] text-[var(--night)]",
      panel: "bg-[var(--night)] text-[var(--ice)]",
      fill: "text-[var(--ice)]",
    },
    outline: {
      root: "border border-[var(--ice)]/40 text-[var(--ice)]",
      panel: "bg-[var(--ice)] text-[var(--night)]",
      fill: "text-[var(--night)]",
    },
    ghostDark: {
      root: "border border-[var(--night)] text-[var(--night)]",
      panel: "bg-[var(--night)] text-[var(--ice)]",
      fill: "text-[var(--ice)]",
    },
  };
  const c = v[variant];
  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      whileHover={prefersReduced ? undefined : { scale: 1.015 }}
      whileTap={prefersReduced ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.25, ease }}
      onPointerDown={pressOn}
      onPointerUp={pressOff}
      onPointerLeave={pressOff}
      onPointerCancel={pressOff}
      onTouchStart={pressOn}
      onTouchEnd={pressOff}
      className={`${base} ${focusRing} ${c.root} ${className}`}
    >
      {/* Resting label — fades out as the panel takes over (hover on desktop, press on touch) */}
      <span
        className={`relative z-10 transition-opacity duration-500 md:group-hover:opacity-0 ${
          isPressed ? "opacity-0" : ""
        }`}
      >
        {children}
      </span>
      {/* Lateral chevron panel — visible affordance at rest; expands to fill (+invert) on hover/press */}
      <span
        aria-hidden
        className={`absolute right-1.5 top-1.5 bottom-1.5 z-20 grid place-items-center rounded-full ${
          c.panel
        } transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:w-[calc(100%-0.75rem)] ${
          isPressed ? "w-[calc(100%-0.75rem)]" : "w-12"
        }`}
      >
        {/* On touch (no hover) a discreet endless nudge signals the button is live */}
        <motion.span
          aria-hidden
          animate={prefersReduced || isDesktop ? { x: 0 } : { x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="grid place-items-center"
        >
          <ChevronRight
            size={18}
            strokeWidth={2.5}
            className="md:transition-transform md:duration-500 md:group-hover:translate-x-0.5"
          />
        </motion.span>
      </span>
      {/* Label re-appears centred over the filled panel */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-500 md:group-hover:opacity-100 ${
          c.fill
        } ${isPressed ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </span>
    </motion.a>
  );
}

/* -------------------- Nav -------------------- */
function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-x flex items-center justify-between pt-6 md:pt-8">
        <a href="#top" className={`flex items-center gap-3 text-[var(--ice)] ${focusRing}`}>
          <MCMark className="h-7 w-auto" />
          <span className="hidden sm:inline font-display text-[11px] uppercase tracking-[0.28em] text-[var(--ice)]/70">
            Matheus Correia / Nutrição
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
          <a href="#metodo" className={`hover:text-[var(--ice)] transition-colors ${focusRing}`}>Método</a>
          <a href="#servicos" className={`hover:text-[var(--ice)] transition-colors ${focusRing}`}>Serviços</a>
          <a href="#faq" className={`hover:text-[var(--ice)] transition-colors ${focusRing}`}>FAQ</a>
        </nav>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className={`group inline-flex items-center gap-2 min-h-[44px] text-[10px] md:text-[11px] uppercase tracking-[0.24em] font-display font-semibold border border-[var(--ice)]/30 rounded-full px-4 py-2.5 text-[var(--ice)] hover:bg-[var(--ice)] hover:text-[var(--night)] transition-colors active:scale-[0.97] ${focusRing}`}
        >
          Agendar{" "}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </header>
  );
}

/* -------------------- Hero -------------------- */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [heroFailed, setHeroFailed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  /* Image drifts up as hero scrolls out — gradient at bottom hides any sub-pixel gap */
  const parallaxY = useTransform(heroScroll, [0, 1], isDesktop ? ["0%", "-10%"] : ["0%", "-7%"]);
  const enableParallax = !prefersReduced;

  const headline = [
    "Nutrição para quem cansou",
    <>de começar <span className="whitespace-nowrap">do zero</span></>,
  ];
  return (
    <section
      ref={heroRef}
      id="top"
      className="relative bg-[var(--night)] text-[var(--ice)] pt-24 md:pt-28 pb-16 md:pb-24 overflow-hidden"
    >
      <Nav />

      {/* Watermark MC */}
      <MCMark
        decorative
        className="pointer-events-none select-none absolute -right-24 -bottom-16 h-[320px] md:h-[420px] w-auto opacity-[0.05]"
      />

      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start relative">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <span className="h-px w-10 bg-[var(--ice)]/40" />
            <p className="eyebrow text-[var(--ice)]/60">Nutrição Clínica · Esportiva</p>
          </motion.div>

          <h1 className="font-display font-extrabold text-[40px] leading-[0.98] sm:text-6xl md:text-7xl lg:text-[96px] tracking-[-0.02em] text-[var(--ice)] text-balance [text-wrap:balance]">
            {headline.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.05 + i * 0.08, ease }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 + headline.length * 0.08, ease }}
                className="block font-narrow italic font-medium text-[var(--mute)] text-[38px] sm:text-5xl md:text-6xl lg:text-[80px] leading-[1.1] tracking-[-0.02em] mt-2 md:mt-3 pb-[0.12em]"
              >
                toda segunda-feira.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 max-w-xl text-base md:text-lg text-[var(--mute)] leading-relaxed"
          >
            Acompanhamento individualizado para organizar sua alimentação, sua rotina e construir um caminho mais consistente para seu resultado no corpo — sem terrorismo nutricional, sem plano genérico e sem exigir uma vida perfeita.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
          >
            <Cta className="w-full sm:w-auto">Agendar avaliação pelo WhatsApp</Cta>
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[var(--ice)]/70 font-display font-semibold leading-relaxed max-w-[15rem]">
              Emagrecimento · Hipertrofia · Recomposição · Rotina real
            </p>
          </motion.div>
        </div>

        {/* Right column: real portrait */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="relative aspect-[4/5] bg-[var(--deep)] border border-[var(--ice)]/10 overflow-hidden"
          >
            {heroFailed ? (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <span className="font-display font-semibold text-[11px] uppercase tracking-[0.24em] text-[var(--mute)] border border-dashed border-[var(--ice)]/25 rounded-md px-4 py-3">
                  [ Inserir foto real do Matheus — hero ]
                </span>
              </div>
            ) : (
              <motion.img
                src={HERO_IMAGE}
                alt="Matheus Correia, nutricionista"
                className="absolute inset-0 h-full w-full object-cover object-[center_22%] grayscale-[15%] contrast-[1.05]"
                style={enableParallax ? { y: parallaxY, scale: isDesktop ? 1.2 : 1.14 } : { scale: 1.08, transformOrigin: "center" }}
                draggable={false}
                onError={() => setHeroFailed(true)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)]/70 via-[var(--night)]/10 to-transparent" />
            {/* Single brand seal — bottom right only */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <MCMark decorative className="h-8 w-auto opacity-90" />
              <div className="text-right leading-tight">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/85 font-display font-semibold">
                  Matheus Correia <span className="text-[var(--ice)]/35">|</span> Nutrição
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--ice)]/55 font-display font-semibold">
                  Routine Performance
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Credibility bar -------------------- */
const CHIPS = [
  "Nutrição Clínica",
  "Nutrição Esportiva",
  "Exames Laboratoriais",
  "Ciências do Emagrecimento",
  "IA aplicada à prática nutricional",
];

function CredibilityBar() {
  return (
    <section className="bg-[var(--night)] text-[var(--ice)] border-t border-[var(--ice)]/10">
      <div className="container-x py-8 md:py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <p className="font-display font-semibold uppercase tracking-[0.2em] text-[12px] md:text-[13px] leading-snug text-[var(--ice)]/80 md:max-w-[11rem]">
          Áreas de atuação e especialidades
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {CHIPS.map((c) => (
            <span
              key={c}
              className="text-[11px] uppercase tracking-[0.18em] font-display font-semibold border border-[var(--ice)]/20 text-[var(--ice)]/85 rounded-full px-4 py-2 transition-colors duration-300 hover:border-[var(--ice)]/40"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Pain / Manifesto -------------------- */
function Pain() {
  /* Three structured pairs: situação → razão. Same grid for every pair
   * keeps a clean rhythm instead of six floating lines. */
  const pairs = [
    { a: "Você até começa bem.", b: "Mas a rotina te engole." },
    { a: "Você sabe o que tem que fazer.", b: "Mas não consegue sustentar." },
    {
      a: "Você não falha porque gosta de comer.",
      b: "Falha porque o plano não foi feito para a sua vida.",
    },
  ];
  return (
    <section className="relative bg-[var(--nearblack)] text-[var(--ice)] py-20 md:py-28 overflow-hidden">
      <MCMark
        decorative
        className="pointer-events-none select-none absolute -left-32 top-1/2 -translate-y-1/2 h-[360px] md:h-[460px] w-auto opacity-[0.04]"
      />
      <div className="container-x relative">
        <div className="flex items-center gap-3 mb-10 md:mb-14">
          <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">Por que você sempre recomeça</p>
        </div>

        <div className="max-w-5xl divide-y divide-[var(--ice)]/10 border-y border-[var(--ice)]/10">
          {pairs.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              className="grid grid-cols-12 gap-6 md:gap-10 py-8 md:py-12 items-baseline"
            >
              <span className="col-span-12 md:col-span-1 text-[11px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="col-span-12 md:col-span-5 font-display font-extrabold text-2xl md:text-4xl lg:text-5xl leading-[1.02] tracking-[-0.02em] text-[var(--ice)]">
                {p.a}
              </h2>
              <p className="col-span-12 md:col-span-6 font-display font-medium text-xl md:text-2xl lg:text-3xl leading-[1.15] tracking-[-0.02em] text-[var(--mute)]">
                {p.b}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="mt-20 md:mt-28"
        >
          <p className="eyebrow text-[var(--mute)] mb-6">A virada</p>
          <h3 className="font-display font-extrabold leading-[1.0] tracking-[-0.02em] text-[var(--ice)]">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-[var(--mute)]">
              Você não precisa de
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">culpa.</span>
          </h3>
          <h3 className="mt-5 md:mt-7 font-display font-extrabold leading-[1.0] tracking-[-0.02em] text-[var(--ice)]">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-[var(--mute)]">
              Precisa de
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">estratégia.</span>
          </h3>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Positioning -------------------- */
function Positioning() {
  const blocks = [
    {
      n: "01",
      label: "Diagnóstico",
      text: "Sua rotina, seus horários, seu treino, sua fome, suas preferências e o que já falhou antes.",
    },
    {
      n: "02",
      label: "Estratégia",
      text: "Um plano construído com comida de verdade, ajustes e protocolo — não uma dieta perfeita no papel.",
    },
    {
      n: "03",
      label: "Continuidade",
      text: "Acompanhamento que tira você do ciclo de começa na segunda e desiste na sexta.",
    },
  ];
  return (
    <section className="bg-[var(--deep)] text-[var(--ice)] border-t border-[var(--ice)]/10 pt-20 md:pt-28 pb-24 md:pb-32">
      <div className="container-x">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 md:mb-16 items-start">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--mute)]">O foco é na sua individualidade</p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="font-display font-extrabold text-[40px] md:text-6xl lg:text-[80px] leading-[0.98] tracking-[-0.02em] text-balance"
            >
              O acompanhamento não começa com um cardápio.
              <span className="block text-[var(--mute)]">Começa entendendo você.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="lg:col-span-5 lg:pt-3 self-start"
          >
            <div className="max-w-md lg:ml-auto">
              <span className="block h-px w-12 bg-[var(--ice)]/30 mb-5" />
              <p className="leading-relaxed tracking-[-0.02em]">
                <span className="block font-display font-bold text-2xl md:text-3xl text-[var(--ice)] tracking-[-0.02em]">
                  Sua rotina é única.
                </span>
                <span className="mt-3 block text-lg md:text-xl text-[var(--ice)]/70">
                  Seu plano alimentar também precisa ser — com estratégia, comida de verdade e ajustes contínuos.
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Three structured blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--ice)]/10 border border-[var(--ice)]/10">
          {blocks.map((b, i) => (
            <motion.div
              key={b.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="bg-[var(--deep)] p-8 md:p-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] tabular-nums font-display font-semibold tracking-[0.24em] text-[var(--mute)]">
                  {b.n}
                </span>
                <span className="h-px flex-1 bg-[var(--ice)]/12" />
              </div>
              <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-[-0.02em] text-[var(--ice)]">
                {b.label}
              </h3>
              <p className="mt-3 text-[var(--ice)]/80 text-[15px] md:text-base leading-relaxed">
                {b.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Method -------------------- */
const METHOD_STEPS = [
  {
    n: "01",
    title: "Entender sua rotina",
    text: "Antes de montar o plano, é preciso entender como você vive, treina, come e onde normalmente desiste.",
  },
  {
    n: "02",
    title: "Definir o objetivo real",
    text: "Emagrecer, ganhar massa ou recompor o corpo exigem estratégias diferentes — não o mesmo cardápio em escala.",
  },
  {
    n: "03",
    title: "Construir uma alimentação possível",
    text: "Comida de verdade, preferências, flexibilidade e protocolo. Um plano que cabe no dia em que tudo deu certo e no dia em que nada deu.",
  },
  {
    n: "04",
    title: "Ajustar antes de você abandonar",
    text: "O acompanhamento corrige rota antes que a rotina vire desculpa para desistir. Esse é o passo onde a maioria das dietas falha — e onde o trabalho começa de verdade.",
  },
];

function Method() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(METHOD_STEPS.length - 1, Math.floor(v * METHOD_STEPS.length));
      setActive(idx);
    });
  }, [scrollYProgress]);

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* Mobile uses the SAME guided sticky-scroll mechanic as desktop (no static cards/boxes). */
  const mobileRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mProgress } = useScroll({
    target: mobileRef,
    offset: ["start start", "end end"],
  });
  const [mActive, setMActive] = useState(0);
  useEffect(() => {
    return mProgress.on("change", (v) => {
      const idx = Math.min(METHOD_STEPS.length - 1, Math.floor(v * METHOD_STEPS.length));
      setMActive(idx);
    });
  }, [mProgress]);
  const mProgressWidth = useTransform(mProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="metodo" className="bg-[var(--night)] text-[var(--ice)] relative">
      <MCMark
        decorative
        className="pointer-events-none select-none absolute -left-32 -top-16 h-[280px] md:h-[360px] w-auto opacity-[0.05]"
      />
      <div className="container-x pt-20 md:pt-28 pb-4 md:pb-8 relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">Método</p>
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-[-0.02em] leading-[0.98] max-w-4xl">
          Um plano feito para sair do papel.
        </h2>
        <p className="mt-6 max-w-2xl font-narrow italic text-[var(--mute)] text-lg md:text-xl leading-snug">
          Flexível não significa sem método. Rígido não significa eficiente.
        </p>
      </div>

      {/* Desktop sticky scroll */}
      <div
        ref={containerRef}
        className="hidden lg:block relative"
        style={{ height: `${METHOD_STEPS.length * 80}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center">
          {/* progress bar */}
          <div className="container-x">
            <div className="h-px w-full bg-[var(--ice)]/10 relative mb-12">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute left-0 top-0 h-px bg-[var(--ice)]"
              />
              <div className="absolute -top-4 left-0 right-0 flex justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
                {METHOD_STEPS.map((s, i) => (
                  <span key={s.n} className={i === active ? "text-[var(--ice)]" : ""}>
                    {s.n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="container-x grid grid-cols-12 gap-12 items-center">
            <div className="col-span-5 flex items-center">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="font-display font-extrabold text-[16rem] xl:text-[20rem] leading-none tracking-[-0.02em] text-[var(--ice)] tabular-nums"
              >
                {METHOD_STEPS[active].n}
              </motion.span>
            </div>
            <div className="col-span-7">
              <motion.div
                key={METHOD_STEPS[active].n + "-card"}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="border-l-2 border-[var(--ice)] pl-8"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
                  Etapa {METHOD_STEPS[active].n} / 04
                </p>
                <h3 className="mt-4 font-display font-extrabold text-4xl xl:text-5xl tracking-[-0.02em] leading-[0.98]">
                  {METHOD_STEPS[active].title}
                </h3>
                <p className="mt-6 text-[var(--mute)] text-lg leading-relaxed max-w-xl">
                  {METHOD_STEPS[active].text}
                </p>
                {active === 3 && (
                  <p className="mt-8 inline-block border border-[var(--ice)]/30 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--ice)] font-display font-semibold">
                    Onde a maioria desiste — onde o trabalho começa
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — same guided sticky-scroll mechanic as desktop, no boxes */}
      <div
        ref={mobileRef}
        className="lg:hidden relative"
        style={{ height: `${METHOD_STEPS.length * 85}vh` }}
      >
        <div className="container-x sticky top-0 flex h-[100svh] flex-col justify-center">
          {/* progress bar + step numbers */}
          <div className="relative mb-10 h-px w-full bg-[var(--ice)]/10">
            <motion.div
              style={{ width: mProgressWidth }}
              className="absolute left-0 top-0 h-px bg-[var(--ice)]"
            />
            <div className="absolute -top-4 left-0 right-0 flex justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold tabular-nums">
              {METHOD_STEPS.map((s, i) => (
                <span key={s.n} className={i === mActive ? "text-[var(--ice)]" : ""}>
                  {s.n}
                </span>
              ))}
            </div>
          </div>

          {/* Giant numeral */}
          <motion.span
            key={mActive}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="font-display font-extrabold text-[7rem] sm:text-[9rem] leading-[0.85] tracking-[-0.02em] text-[var(--ice)] tabular-nums"
          >
            {METHOD_STEPS[mActive].n}
          </motion.span>

          {/* Title + text */}
          <motion.div
            key={METHOD_STEPS[mActive].n + "-m"}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mt-5 border-l-2 border-[var(--ice)] pl-5"
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
              Etapa {METHOD_STEPS[mActive].n} / 04
            </p>
            <h3 className="mt-3 font-display font-extrabold text-2xl sm:text-3xl tracking-[-0.02em] leading-[1.05]">
              {METHOD_STEPS[mActive].title}
            </h3>
            <p className="mt-4 text-[var(--mute)] leading-relaxed text-sm sm:text-base">
              {METHOD_STEPS[mActive].text}
            </p>
            {mActive === 3 && (
              <p className="mt-5 inline-block rounded-full border border-[var(--ice)]/30 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[var(--ice)] font-display font-semibold">
                Onde a maioria desiste — onde o trabalho começa
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Training + Nutrition -------------------- */
type MotionVal = ReturnType<typeof useTransform<number, string>> | ReturnType<typeof useTransform<number, number>>;

function ImmersivePhoto({
  src,
  alt,
  objectPos,
  topCaption,
  bottomCaption,
  className = "",
  parallaxOn,
  deep,
  photoY,
  frameY,
  scale,
  frameScale,
  wipeX,
  captionOpacity,
}: {
  src: string;
  alt: string;
  objectPos: string;
  topCaption: string;
  bottomCaption: string;
  className?: string;
  parallaxOn: boolean;
  deep: boolean;
  photoY: MotionVal;
  frameY: MotionVal;
  scale: MotionVal;
  frameScale: MotionVal;
  wipeX: MotionVal;
  captionOpacity: MotionVal;
}) {
  /* Parallax (translateY + breath scale) goes directly on the img. The entry animation only
   * touches opacity/filter — never scale/transform — so it can't clobber the parallax. */
  const imgStyle = parallaxOn
    ? ({ y: photoY, scale, objectPosition: objectPos } as unknown as CSSProperties)
    : ({ scale: 1.04, objectPosition: objectPos } as unknown as CSSProperties);
  const frameStyle = deep
    ? ({ y: frameY, scale: frameScale } as unknown as CSSProperties)
    : undefined;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease }}
      className={className}
    >
      <motion.div
        style={frameStyle}
        className="relative aspect-[4/5] w-full will-change-transform"
      >
        {/* Thin frame ring */}
        <div className="absolute -inset-px border border-[var(--ice)]/15 pointer-events-none z-20" />

        <div className="relative h-full w-full overflow-hidden bg-[var(--deep)]">
          {/* Curtain reveal on enter */}
          <motion.div
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease, delay: 0.1 }}
            style={{ originY: 0 }}
            className="absolute inset-0 z-10 bg-[var(--nearblack)]"
            aria-hidden
          />

          {/* Image — oversized (130%) so the parallax translateY never reveals an edge.
              Parallax y/scale ride on the img via style; entry only fades + de-blurs. */}
          <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="absolute inset-0 -top-[15%] h-[130%] w-full object-cover grayscale-[12%] contrast-[1.05] will-change-transform"
            style={imgStyle}
            draggable={false}
          />

          {/* Gradient depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)]/75 via-[var(--night)]/10 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--night)]/40 z-10" />

          {/* Wipe line traveling across on scroll (desktop depth only) */}
          {deep && (
            <motion.div
              aria-hidden
              style={{ x: wipeX } as unknown as CSSProperties}
              className="absolute top-0 bottom-0 w-[40%] z-10 pointer-events-none bg-gradient-to-r from-transparent via-[var(--ice)]/8 to-transparent mix-blend-screen"
            />
          )}

          {/* Top caption (fades with scroll on desktop; static on mobile for legibility) */}
          <motion.div
            style={deep ? ({ opacity: captionOpacity } as unknown as CSSProperties) : undefined}
            className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/85 font-display font-semibold"
          >
            <span className="flex items-center gap-2">
              <span className="h-px w-6 bg-[var(--ice)]/60" />
              {topCaption}
            </span>
            <span>{bottomCaption}</span>
          </motion.div>

          {/* Bottom watermark */}
          <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
            <MCMark decorative className="h-7 w-auto opacity-80" />
            <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/60 font-display font-semibold">
              MC / Nutrição
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrainingNutrition() {
  return (
    <TrainingMediaStage
      videoSrc="/media/fala-nutri-video-02.mp4"
      posterSrc="/media/fala-nutri-video-02-poster.jpg"
      bagSrc="/media/fala-nutri-bag.jpg"
    />
  );
}

/* -------------------- Real Life -------------------- */
function RealLife() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    y: photoY,
    frameY,
    textY,
    scale,
    frameScale,
    wipeX,
    captionOpacity,
    enabled,
    isDesktop,
  } = useParallax(sectionRef);
  const parallaxOn = enabled;
  const deep = enabled && isDesktop;
  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--night)] text-[var(--ice)] overflow-hidden py-20 md:py-28 lg:py-32"
    >
      <div className="container-x relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <ImmersivePhoto
          src="/matheus-burger.jpg"
          alt="Matheus Correia — alimentação real com estratégia"
          objectPos="center 40%"
          topCaption="Rotina real"
          bottomCaption="Estratégia · não proibição"
          className="lg:col-span-6"
          parallaxOn={parallaxOn}
          deep={deep}
          photoY={photoY}
          frameY={frameY}
          scale={scale}
          frameScale={frameScale}
          wipeX={wipeX}
          captionOpacity={captionOpacity}
        />

        {/* Text */}
        <motion.div
          style={deep ? { y: textY } : undefined}
          className="lg:col-span-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--mute)]">Estratégia para uma rotina imperfeita</p>
            </div>
            <h2 className="font-display font-extrabold text-[32px] md:text-5xl lg:text-[60px] leading-[0.98] tracking-[-0.02em] text-[var(--ice)]">
              Hambúrguer, chocolate e vida social{" "}
              <span className="text-[var(--mute)]">não precisam ser o fim do seu resultado.</span>
            </h2>
            <p className="mt-8 text-[var(--ice)]/85 text-base md:text-lg leading-relaxed max-w-lg">
              O problema não é uma refeição fora do plano. É não ter estratégia para lidar com ela.
            </p>
            <h3 className="mt-10 font-display font-bold text-xl md:text-2xl tracking-[-0.03em] leading-[1.15]">
              O plano certo não te prende.
              <span className="block text-[var(--mute)]">Te dá direção.</span>
            </h3>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Proof Social (Declarações) -------------------- */
type Testimonial = {
  quote: string;
  label: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "O dinheiro bem gasto. Pensei que era leseira isso. Malhava um mês, mas não saía nada.",
    label: "Paciente em acompanhamento",
  },
  {
    quote:
      "O bom da dieta que tu montou são as variedades que consigo escolher. O cara não enjoa.",
    label: "Paciente em acompanhamento",
  },
  {
    quote: "Consegui seguir o planejamento perfeitamente, não tive nenhuma dificuldade.",
    label: "Paciente em acompanhamento",
  },
  {
    quote: "Percebi mudanças no peso, estou me sentindo menos inchado e mais leve.",
    label: "Paciente em acompanhamento",
  },
  {
    quote: "Nenhuma dificuldade para seguir.",
    label: "Paciente em acompanhamento",
  },
];

const PROOF_PHOTOS = [
  { src: "/media/paciente-mulher-clinica.jpg", alt: "Atendimento nutricional em consultório" },
  { src: "/media/paciente-homem-clinica.jpg", alt: "Atendimento nutricional em consultório" },
];

function QuoteCard({ quote, label }: Testimonial) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease }}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--ice)]/12 bg-[var(--nearblack)] p-6 md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-2 left-5 select-none font-display font-black leading-none text-[5.5rem] text-[var(--ice)]/[0.06]"
      >
        &ldquo;
      </span>
      <blockquote className="relative text-[var(--ice)]/90 text-base md:text-lg leading-relaxed tracking-[-0.02em]">
        {quote}
      </blockquote>
      <figcaption className="relative mt-6 flex items-center gap-3">
        <span className="h-px w-6 bg-[var(--ice)]/30" />
        <span className="text-[10px] font-display font-semibold uppercase tracking-[0.24em] text-[var(--mute)]">
          {label}
        </span>
      </figcaption>
    </motion.figure>
  );
}

function ProofSocialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  return (
    <section ref={sectionRef} className="relative bg-[var(--deep)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32 overflow-hidden">
      <div className="container-x relative">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--mute)]">Declarações</p>
            </div>
            <h2 className="font-display font-extrabold text-[40px] md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.02em]">
              Pessoas reais.
              <span className="block text-[var(--mute)]">Rotina real.</span>
              <span className="block">Evolução real.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base md:text-lg text-[var(--ice)]/75 leading-relaxed max-w-md lg:ml-auto">
              Relatos de quem passou pelo processo com estratégia, ajuste e acompanhamento.
            </p>
          </div>
        </div>

        {/* Supporting photos — apoio visual (não antes/depois) */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 mb-10 md:mb-12">
          {PROOF_PHOTOS.map((p) => (
            <motion.div
              key={p.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--ice)]/10 bg-[var(--nearblack)]"
            >
              <motion.img
                src={p.src}
                alt={p.alt}
                style={{ y: imgY }}
                className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover object-top grayscale-[15%] contrast-[1.05] will-change-transform"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--night)]/40 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Quote grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <QuoteCard key={i} quote={t.quote} label={t.label} />
          ))}
        </div>

        {/* Google reviews — own anchor (Cta aponta para WhatsApp) */}
        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row sm:items-center gap-5">
          <a
            href="https://g.page/r/CT858OLaJsGrEAI/review"
            target="_blank"
            rel="noreferrer"
            className={`group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-[var(--ice)]/40 px-7 text-[12px] md:text-[13px] font-display font-bold uppercase tracking-[0.2em] text-[var(--ice)] transition-colors duration-300 hover:bg-[var(--ice)] hover:text-[var(--night)] ${focusRing}`}
          >
            Ver avaliações no Google
            <ChevronRight
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--mute)] font-display font-semibold leading-relaxed max-w-xs">
            Depoimentos reais de pacientes em acompanhamento.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Services -------------------- */
const SERVICES = [
  { t: "Emagrecimento", d: "Plano com déficit sustentável e ajuste contínuo." },
  { t: "Hipertrofia", d: "Estratégia para ganho de massa com qualidade." },
  { t: "Recomposição corporal", d: "Perder gordura e ganhar massa em paralelo." },
  { t: "Nutrição para treino", d: "Energia, proteína e recuperação organizadas." },
  { t: "Acompanhamento contínuo", d: "Formato definido após avaliação, com ajustes conforme evolução." },
  { t: "Rotina real", d: "Plano que cabe em quem trabalha, treina e vive." },
];

function Services() {
  return (
    <section
      id="servicos"
      className="relative bg-[var(--night)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32 overflow-hidden"
    >
      <MCMark
        decorative
        className="pointer-events-none select-none absolute -right-32 -bottom-24 h-[420px] md:h-[560px] w-auto opacity-[0.04]"
      />
      <div className="container-x relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--mute)]">Serviços</p>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-[64px] tracking-[-0.02em] leading-[0.98]">
              Um trabalho,
              <span className="block text-[var(--mute)]">vários objetivos.</span>
            </h2>
            <p className="mt-7 text-[var(--ice)]/80 text-base md:text-[17px] leading-relaxed max-w-md">
              Prática clínica, vivência no treino e atualização constante — planos que não existem só no papel.
            </p>
            <div className="mt-10 flex flex-col gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--mute)] font-display font-semibold">
              <span className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--ice)]/30" /> Formato definido após avaliação
              </span>
              <span className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--ice)]/30" /> Estratégia adaptada à rotina
              </span>
              <span className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--ice)]/30" /> Acompanhamento contínuo
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-[var(--ice)]/15">
            {SERVICES.map((s, i) => (
              <ServiceRow key={s.t} index={i} title={s.t} desc={s.d} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease }}
      className={`group relative block border-b border-[var(--ice)]/15 isolate overflow-hidden ${focusRing}`}
    >
      {/* Hover fill — wipes in from left */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-[var(--petrol)]/35 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <div className="relative px-2 md:px-6 py-7 md:py-10">
        {/* Mobile: stacked. Desktop: 3 columns */}
        <div className="md:grid md:grid-cols-12 md:gap-8 md:items-center">
          <span className="block md:col-span-1 text-[11px] tabular-nums font-display font-semibold tracking-[0.22em] text-[var(--mute)] group-hover:text-[var(--ice)] transition-colors duration-300">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="md:col-span-6 mt-3 md:mt-0 font-display font-extrabold text-[26px] md:text-3xl lg:text-[40px] tracking-[-0.02em] leading-[0.98] text-[var(--ice)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
            {title}
          </h3>

          <p className="md:col-span-5 mt-3 md:mt-0 text-sm md:text-base text-[var(--mute)] leading-relaxed max-w-md group-hover:text-[var(--ice)]/85 transition-colors duration-300">
            {desc}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

/* -------------------- FAQ -------------------- */
const FAQS = [
  { q: "Preciso cortar tudo que gosto?", a: "Não. O plano é construído com estratégia, não com proibição. A ideia é organizar quantidade, frequência e contexto, mantendo comida real e o que você gosta dentro do que faz sentido para seu objetivo." },
  { q: "O plano serve para quem treina?", a: "Sim. O foco do trabalho é justamente unir treino e nutrição, organizando energia, performance e recuperação para o esforço se refletir na sua evolução." },
  { q: "Funciona para quem tem rotina corrida?", a: "É feito para isso. O plano é desenhado a partir da sua rotina real — horários, deslocamentos, refeições fora — e não de um cenário ideal que não existe." },
  { q: "Como é definido o formato do acompanhamento?", a: "O formato é definido após avaliação, considerando objetivo, rotina e necessidade de acompanhamento. Os ajustes acontecem conforme a evolução." },
  { q: "Como funciona a primeira consulta?", a: "Conversamos sobre seu histórico, objetivo, rotina, treino e preferências. A partir disso é construído o plano e definido o ritmo de acompanhamento." },
  { q: "O plano é individualizado?", a: "Sim. Nada de cardápio padrão — cada plano é construído para a pessoa, seu objetivo e seu contexto." },
  { q: "Como faço para agendar?", a: "Pelo WhatsApp, clicando em qualquer botão de agendamento desta página." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="bg-[var(--deep)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32"
    >
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">Perguntas frequentes</p>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-[-0.02em] leading-[0.98]">
            Antes da primeira consulta.
          </h2>
        </div>
        <div className="lg:col-span-8">
          <div className="border-t border-[var(--ice)]/20">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-[var(--ice)]/20">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className={`w-full flex items-center justify-between gap-6 py-6 text-left ${focusRing}`}
                  >
                    <span className="font-display font-bold text-lg md:text-2xl tracking-[-0.025em] text-[var(--ice)]">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`text-2xl text-[var(--ice)] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    className="grid transition-[grid-template-rows] duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-10 text-[var(--mute)] leading-relaxed max-w-2xl">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Final CTA -------------------- */
function FinalCta() {
  return (
    <section className="relative bg-[var(--night)] text-[var(--ice)] py-28 md:py-40 overflow-hidden">
      <MCMark
        decorative
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -bottom-20 h-[320px] md:h-[440px] w-auto opacity-[0.05]"
      />
      <div className="container-x text-center max-w-5xl mx-auto relative">
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">Comece</p>
          <span className="h-px w-10 bg-[var(--ice)]/40" />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.02em]"
        >
          Pare de recomeçar toda segunda.
          <span className="block text-[var(--mute)] text-3xl md:text-5xl lg:text-6xl mt-3">
            Comece a seguir um plano feito para você continuar.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mt-10 text-[var(--mute)] max-w-2xl mx-auto text-lg leading-relaxed"
        >
          Transforme sua alimentação, sua rotina e seu resultado com um acompanhamento individualizado — sem culpa, sem terrorismo nutricional e sem dieta genérica.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="mt-12 flex justify-center"
        >
          <Cta variant="ice" className="w-full sm:w-auto md:min-h-[62px]">
            Falar com Matheus no WhatsApp
          </Cta>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Footer -------------------- */
function Footer() {
  return (
    <footer className="bg-[var(--nearblack)] text-[var(--mute)] border-t border-[var(--ice)]/10">
      <div className="container-x py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Brand mark (name lives only in the copyright line below) */}
        <div className="flex items-center gap-3 text-[var(--ice)]">
          <MCMark className="h-7 w-auto" />
        </div>
        {/* Contact */}
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] font-display font-semibold">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className={`group inline-flex items-center gap-2 text-[var(--ice)]/90 hover:text-[var(--ice)] transition-colors ${focusRing}`}
          >
            WhatsApp
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="https://www.instagram.com/matheuscorreianutri/"
            target="_blank"
            rel="noreferrer"
            className={`group inline-flex items-center gap-2 text-[var(--ice)]/90 hover:text-[var(--ice)] transition-colors ${focusRing}`}
          >
            Instagram
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
      {/* Copyright */}
      <div className="container-x pb-10">
        <p className="text-[12px] leading-relaxed text-[var(--mute)]/80">
          © 2026 Matheus Correia — nutricionista clínico, esportivo e Routine Performance.
        </p>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <main className="bg-[var(--night)] text-[var(--ice)] selection:bg-[var(--ice)] selection:text-[var(--night)]">
      <Hero />
      <CredibilityBar />
      <Pain />
      <Positioning />
      <Method />
      <TrainingNutrition />
      <RealLife />
      <ProofSocialSection />
      <Services />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
