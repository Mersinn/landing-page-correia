import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState, useEffect, type CSSProperties } from "react";
import mcSymbolWhite from "@/assets/mc-symbol-white.svg.asset.json";
import matheusHero from "@/assets/matheus-hero.jpg.asset.json";

const WHATSAPP = "https://wa.me/message/K5WYIUI5FXYFE1";

const ease = [0.22, 1, 0.36, 1] as const;

/* Shared parallax hook — desktop only, respects prefers-reduced-motion */
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
  /* Deep parallax — image moves a lot inside its 130% container */
  const y = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  /* Frame itself drifts subtly the OPPOSITE way for layered depth */
  const frameY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  /* Counter-movement on foreground text */
  const textY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  /* Cinematic breath on the photo */
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.0, 1.08]);
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
    enabled: isDesktop && !prefersReduced,
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/* -------------------- MC Mark (real brand symbol) -------------------- */
function MCMark({ className = "", title = "Matheus Correia" }: { className?: string; title?: string }) {
  return (
    <img
      src={mcSymbolWhite.url}
      alt={title}
      aria-label={title}
      className={className}
      draggable={false}
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
  const base =
    "group inline-flex items-center justify-center gap-3 px-8 py-4 text-[11px] md:text-[12px] font-display font-semibold tracking-[0.22em] uppercase rounded-full whitespace-nowrap leading-none transition-colors duration-300";
  const variantClass: Record<string, string> = {
    ice: "bg-[var(--ice)] text-[var(--night)] hover:bg-[var(--mute)] hover:text-[var(--ice)]",
    outline:
      "border border-[var(--ice)]/30 text-[var(--ice)] hover:bg-[var(--ice)] hover:text-[var(--night)]",
    ghostDark:
      "border border-[var(--night)] text-[var(--night)] hover:bg-[var(--night)] hover:text-[var(--ice)]",
  };
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${variantClass[variant]} ${className}`}
    >
      <span>{children}</span>
      <span aria-hidden>→</span>
    </a>
  );
}

/* -------------------- Nav -------------------- */
function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-x flex items-center justify-between pt-6 md:pt-8">
        <a href="#top" className="flex items-center gap-3 text-[var(--ice)]">
          <MCMark className="h-7 w-auto" />
          <span className="hidden sm:inline font-display text-[11px] uppercase tracking-[0.28em] text-[var(--ice)]/70">
            Matheus Correia / Nutrição
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
          <a href="#metodo" className="hover:text-[var(--ice)] transition-colors">Método</a>
          <a href="#servicos" className="hover:text-[var(--ice)] transition-colors">Serviços</a>
          <a href="#faq" className="hover:text-[var(--ice)] transition-colors">FAQ</a>
        </nav>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.24em] font-display font-semibold border border-[var(--ice)]/30 rounded-full px-4 py-2 text-[var(--ice)] hover:bg-[var(--ice)] hover:text-[var(--night)] transition-colors"
        >
          Agendar <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}

/* -------------------- Hero -------------------- */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
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
  const parallaxY = useTransform(heroScroll, [0, 1], ["0%", "-6%"]);
  const enableParallax = isDesktop && !prefersReduced;

  const headline = [
    "Nutrição para quem cansou",
    "de começar do zero",
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
        aria-hidden
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

          <h1 className="font-display font-extrabold text-[44px] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[96px] tracking-[-0.045em] text-[var(--ice)]">
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
                className="block font-narrow italic font-medium text-[var(--mute)] text-[28px] sm:text-4xl md:text-5xl lg:text-[56px] tracking-[-0.02em] mt-2 md:mt-4"
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
            Acompanhamento individualizado para transformar sua alimentação, sua rotina e seu resultado no corpo — sem terrorismo nutricional, sem plano genérico e sem exigir uma vida perfeita.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
          >
            <Cta>Agendar avaliação pelo WhatsApp</Cta>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--mute)] font-display font-semibold">
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
            <motion.img
              src={matheusHero.url}
              alt="Matheus Correia, nutricionista"
              className="absolute inset-0 h-full w-full object-cover object-[center_22%] grayscale-[15%] contrast-[1.05]"
              style={enableParallax ? { y: parallaxY, scale: 1.2 } : { scale: 1.08, transformOrigin: "center" }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)]/70 via-[var(--night)]/10 to-transparent" />
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/80 font-display font-semibold">
              <span>Matheus Correia</span>
              <span>CRN · Nutrição</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <MCMark className="h-8 w-auto opacity-90" />
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/70 font-display font-semibold max-w-[10rem] text-right">
                Routine<br />Performance
              </p>
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
        <p className="eyebrow text-[var(--mute)] md:whitespace-nowrap">Áreas de atuação</p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {CHIPS.map((c) => (
            <span
              key={c}
              className="text-[11px] uppercase tracking-[0.18em] font-display font-semibold border border-[var(--ice)]/15 text-[var(--ice)]/80 rounded-full px-4 py-2"
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
        aria-hidden
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
              <h2 className="col-span-12 md:col-span-5 font-display font-extrabold text-2xl md:text-4xl lg:text-5xl leading-[1.02] tracking-[-0.035em] text-[var(--ice)]">
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
          <h3 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.045em] text-[var(--ice)]">
            Você não precisa de culpa.
          </h3>
          <h3 className="mt-3 md:mt-5 font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.045em]">
            Precisa de{" "}
            <span
              className="italic font-extrabold"
              style={{
                WebkitTextStroke: "1.5px var(--ice)",
                color: "transparent",
              }}
            >
              estratégia.
            </span>
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
    <section className="bg-[var(--deep)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32">
      <div className="container-x">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--mute)]">Individualidade</p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="font-display font-extrabold text-[40px] md:text-6xl lg:text-[80px] leading-[0.95] tracking-[-0.045em]"
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
            className="lg:col-span-5 lg:pt-4 self-end"
          >
            <p className="text-base md:text-lg text-[var(--mute)] leading-relaxed max-w-md lg:ml-auto">
              Sua rotina é única. Seu plano alimentar também precisa ser — com estratégia, comida de verdade e ajustes contínuos.
            </p>
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
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-display font-extrabold text-5xl md:text-6xl tabular-nums tracking-[-0.04em] text-[var(--ice)]">
                  {b.n}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
                  {b.label}
                </span>
              </div>
              <p className="text-[var(--ice)]/85 text-base md:text-[17px] leading-relaxed">
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

  return (
    <section id="metodo" className="bg-[var(--night)] text-[var(--ice)] relative">
      <MCMark
        aria-hidden
        className="pointer-events-none select-none absolute -left-32 -top-16 h-[280px] md:h-[360px] w-auto opacity-[0.05]"
      />
      <div className="container-x pt-24 md:pt-32 pb-8 md:pb-14 relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">Método</p>
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-[-0.045em] leading-[0.98] max-w-4xl">
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
        style={{ height: `${METHOD_STEPS.length * 100}vh` }}
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
                className="font-display font-extrabold text-[16rem] xl:text-[20rem] leading-none tracking-[-0.06em] text-[var(--ice)] tabular-nums"
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
                <h3 className="mt-4 font-display font-extrabold text-4xl xl:text-5xl tracking-[-0.04em] leading-[1.0]">
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

      {/* Mobile/tablet stacked */}
      <div className="lg:hidden container-x pb-24 mt-4 space-y-4">
        {METHOD_STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="border border-[var(--ice)]/12 bg-[var(--deep)] p-6 rounded-lg"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display font-extrabold text-6xl text-[var(--ice)] tabular-nums tracking-[-0.05em] leading-none">
                {step.n}
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
                / 04
              </span>
            </div>
            <h3 className="mt-5 font-display font-extrabold text-2xl tracking-[-0.035em] leading-[1.05]">
              {step.title}
            </h3>
            <p className="mt-3 text-[var(--mute)] leading-relaxed text-sm">{step.text}</p>
          </motion.div>
        ))}
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
  photoY: MotionVal;
  frameY: MotionVal;
  scale: MotionVal;
  frameScale: MotionVal;
  wipeX: MotionVal;
  captionOpacity: MotionVal;
}) {
  const imgStyle = parallaxOn
    ? ({ y: photoY, scale } as unknown as CSSProperties)
    : ({ scale: 1.04 } as unknown as CSSProperties);
  const frameStyle = parallaxOn
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

          <motion.img
            src={src}
            alt={alt}
            initial={{ scale: 1.18, filter: "blur(8px)" }}
            whileInView={{ scale: 1.04, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.6, ease, delay: 0.2 }}
            className="absolute inset-0 -top-[15%] h-[130%] w-full object-cover grayscale-[12%] contrast-[1.05] will-change-transform"
            style={{ ...imgStyle, objectPosition: objectPos }}
            draggable={false}
          />

          {/* Gradient depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)]/75 via-[var(--night)]/10 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--night)]/40 z-10" />

          {/* Wipe line traveling across on scroll */}
          {parallaxOn && (
            <motion.div
              aria-hidden
              style={{ x: wipeX } as unknown as CSSProperties}
              className="absolute top-0 bottom-0 w-[40%] z-10 pointer-events-none bg-gradient-to-r from-transparent via-[var(--ice)]/8 to-transparent mix-blend-screen"
            />
          )}

          {/* Top caption */}
          <motion.div
            style={parallaxOn ? ({ opacity: captionOpacity } as unknown as CSSProperties) : undefined}
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
            <MCMark className="h-7 w-auto opacity-80" />
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
  const sectionRef = useRef<HTMLElement>(null);
  const {
    y: photoY,
    frameY,
    textY,
    scale,
    frameScale,
    wipeX,
    captionOpacity,
    enabled: parallaxOn,
  } = useParallax(sectionRef);
  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--nearblack)] text-[var(--ice)] border-t border-[var(--ice)]/10 overflow-hidden py-20 md:py-28 lg:py-32"
    >
      <div className="container-x relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Text */}
        <motion.div
          style={parallaxOn ? { y: textY } : undefined}
          className="lg:col-span-6 order-2 lg:order-1"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--mute)]">Treino + Nutrição</p>
            </div>
            <h2 className="font-display font-extrabold text-[34px] md:text-5xl lg:text-[60px] leading-[0.98] tracking-[-0.045em]">
              A academia constrói <span className="text-[var(--mute)]">o estímulo.</span>
              <span className="block">A nutrição constrói o resultado.</span>
            </h2>
            <p className="mt-8 text-[var(--ice)]/85 text-base md:text-lg leading-relaxed max-w-lg">
              Se você já faz esforço na academia, sua alimentação precisa trabalhar junto — organizando energia, proteína e recuperação para esse esforço aparecer no corpo.
            </p>
            <p className="mt-10 text-[10px] uppercase tracking-[0.24em] text-[var(--mute)] font-display font-semibold">
              Arnold Sports · South America
            </p>
          </motion.div>
        </motion.div>

        <ImmersivePhoto
          src="/matheus-arnold.jpg"
          alt="Matheus Correia no Arnold Sports Festival South America"
          objectPos="center 25%"
          topCaption="Arnold · 2024"
          bottomCaption="Treino · Performance"
          tagNumber="05"
          className="lg:col-span-6 order-1 lg:order-2"
          parallaxOn={parallaxOn}
          photoY={photoY}
          frameY={frameY}
          scale={scale}
          frameScale={frameScale}
          wipeX={wipeX}
          captionOpacity={captionOpacity}
        />
      </div>
    </section>
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
    enabled: parallaxOn,
  } = useParallax(sectionRef);
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
          topCaption="Vida real"
          bottomCaption="Estratégia · não proibição"
          tagNumber="06"
          className="lg:col-span-6"
          parallaxOn={parallaxOn}
          photoY={photoY}
          frameY={frameY}
          scale={scale}
          frameScale={frameScale}
          wipeX={wipeX}
          captionOpacity={captionOpacity}
        />

        {/* Text */}
        <motion.div
          style={parallaxOn ? { y: textY } : undefined}
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
              <p className="eyebrow text-[var(--mute)]">Vida real</p>
            </div>
            <h2 className="font-display font-extrabold text-[32px] md:text-5xl lg:text-[60px] leading-[0.98] tracking-[-0.045em] text-[var(--ice)]">
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

/* -------------------- Services -------------------- */
const SERVICES = [
  { t: "Emagrecimento", d: "Plano com déficit sustentável e ajuste contínuo." },
  { t: "Hipertrofia", d: "Estratégia para ganho de massa com qualidade." },
  { t: "Recomposição corporal", d: "Perder gordura e ganhar massa em paralelo." },
  { t: "Nutrição para treino", d: "Energia, proteína e recuperação organizadas." },
  { t: "Acompanhamento online", d: "Atendimento à distância com ajustes regulares." },
  { t: "Rotina real", d: "Plano que cabe em quem trabalha, treina e vive." },
];

function Services() {
  return (
    <section
      id="servicos"
      className="relative bg-[var(--night)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32 overflow-hidden"
    >
      <MCMark
        aria-hidden
        className="pointer-events-none select-none absolute -right-32 -bottom-24 h-[420px] md:h-[560px] w-auto opacity-[0.04]"
      />
      <div className="container-x relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-6 lg:sticky lg:top-24">
            <span className="h-px w-10 bg-[var(--ice)]/40" />
            <p className="eyebrow text-[var(--mute)]">Serviços</p>
          </div>
          <div className="lg:sticky lg:top-32">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-[64px] tracking-[-0.045em] leading-[0.95]">
              Um trabalho,
              <span className="block text-[var(--mute)]">vários objetivos.</span>
            </h2>
            <p className="mt-8 text-[var(--mute)] text-base leading-relaxed max-w-md">
              Prática clínica, vivência no treino e atualização constante — planos que não existem só no papel.
            </p>
            <div className="mt-10 flex flex-col gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--mute)] font-display font-semibold">
              <span className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--ice)]/30" /> Presencial
              </span>
              <span className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--ice)]/30" /> Online
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
      transition={{ duration: 0.6, delay: index * 0.05, ease }}
      className="group relative block border-b border-[var(--ice)]/15 py-7 md:py-8 isolate overflow-hidden"
    >
      {/* Hover fill — wipes in from left */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[var(--petrol)]/35 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-8 items-baseline px-2 md:px-4">
        <span className="col-span-2 md:col-span-1 text-[11px] tabular-nums font-display font-semibold tracking-[0.22em] text-[var(--mute)] group-hover:text-[var(--ice)] transition-colors duration-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="col-span-10 md:col-span-5 font-display font-extrabold text-2xl md:text-3xl lg:text-[40px] tracking-[-0.035em] leading-[1.0] text-[var(--ice)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
          {title}
        </h3>
        <p className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto text-sm md:text-base text-[var(--mute)] leading-relaxed group-hover:text-[var(--ice)]/85 transition-colors duration-300">
          {desc}
        </p>
        <span
          aria-hidden
          className="hidden md:flex col-span-1 justify-end text-[var(--ice)] text-xl leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2"
        >
          →
        </span>
      </div>
    </motion.a>
  );
}

/* -------------------- FAQ -------------------- */
const FAQS = [
  { q: "Preciso cortar tudo que gosto?", a: "Não. O plano é construído com estratégia, não com proibição. A ideia é organizar quantidade, frequência e contexto, mantendo comida real e o que você gosta dentro do que faz sentido para seu objetivo." },
  { q: "O plano serve para quem treina?", a: "Sim. O foco do trabalho é justamente unir treino e nutrição, organizando energia, proteína e recuperação para o esforço aparecer no corpo." },
  { q: "Funciona para quem tem rotina corrida?", a: "É feito para isso. O plano é desenhado a partir da sua rotina real — horários, deslocamentos, refeições fora — e não de um cenário ideal que não existe." },
  { q: "O atendimento pode ser online?", a: "Sim, com acompanhamento estruturado, ajustes regulares e contato direto entre as consultas." },
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
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-[-0.045em] leading-[0.98]">
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
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display font-bold text-lg md:text-2xl tracking-[-0.025em] text-[var(--ice)]">
                      {f.q}
                    </span>
                    <span
                      className={`text-2xl text-[var(--ice)] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
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
        aria-hidden
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
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.045em]"
        >
          Pare de recomeçar toda segunda.
          <span className="block text-[var(--mute)]">
            Comece a seguir um plano feito para você continuar.
          </span>
        </motion.h2>
        <p className="mt-10 text-[var(--mute)] max-w-2xl mx-auto text-lg leading-relaxed">
          Transforme sua alimentação, sua rotina e seu resultado com um acompanhamento individualizado — sem culpa, sem terrorismo nutricional e sem dieta genérica.
        </p>
        <div className="mt-12 flex justify-center">
          <Cta variant="ice" className="text-base px-9 py-5">
            Falar com Matheus no WhatsApp
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Footer -------------------- */
function Footer() {
  return (
    <footer className="bg-[var(--nearblack)] text-[var(--mute)] border-t border-[var(--ice)]/10">
      <div className="container-x py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] uppercase tracking-[0.22em] font-display font-semibold">
        <div className="flex items-center gap-3 text-[var(--ice)]">
          <MCMark className="h-6 w-auto" />
          <span>Matheus Correia / Nutrição</span>
        </div>
        <span>© {new Date().getFullYear()} · Routine Performance</span>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--ice)] transition-colors"
        >
          WhatsApp →
        </a>
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
      <Services />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
