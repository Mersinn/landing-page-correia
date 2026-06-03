import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import matheusLamp from "@/assets/matheus-lamp.png.asset.json";

const WHATSAPP = "https://wa.me/message/K5WYIUI5FXYFE1";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/* -------------------- Brand Mark (official Matheus Correia) -------------------- */
function MCMark({ className = "", title = "MC" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 700.22 251.21"
      role="img"
      aria-label={title}
      className={className}
      fill="currentColor"
    >
      <polygon points="258.64 27.86 208.94 116.23 192.92 87.93 139.17 182.85 100.5 251.21 0 251.21 142.24 0 242.85 0 258.64 27.86" />
      <polygon points="700.22 0 659.46 72.01 494.2 72.01 466.97 120.1 466.97 120.14 431.45 182.85 490.22 182.85 451.79 251.21 314.66 251.21 349.88 189.04 349.88 189 353.36 182.85 353.39 182.85 378.44 138.57 416.14 72.01 427.94 51.14 456.87 0 700.22 0" />
      <polygon points="414.8 27.93 365.46 115.62 349.95 88.23 321.38 138.67 321.38 138.7 296.4 182.85 271.55 226.8 257.7 251.21 156.79 251.21 195.49 182.85 221.04 137.7 258.27 72.01 270.95 49.57 299.01 0 398.98 0 399.45 .84 414.8 27.93" />
      <polygon points="596.68 182.85 562.69 242.88 557.98 251.21 477.24 251.21 515.67 182.85 596.68 182.85" />
    </svg>
  );
}

/* MC Symbol used as square watermark (auto squarish viewbox crop) */
function MCBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="100 0 500 251.21"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <polygon points="258.64 27.86 208.94 116.23 192.92 87.93 139.17 182.85 100.5 251.21 0 251.21 142.24 0 242.85 0 258.64 27.86" />
      <polygon points="414.8 27.93 365.46 115.62 349.95 88.23 321.38 138.67 321.38 138.7 296.4 182.85 271.55 226.8 257.7 251.21 156.79 251.21 195.49 182.85 221.04 137.7 258.27 72.01 270.95 49.57 299.01 0 398.98 0 399.45 .84 414.8 27.93" />
      <polygon points="596.68 182.85 562.69 242.88 557.98 251.21 477.24 251.21 515.67 182.85 596.68 182.85" />
      <polygon points="700.22 0 659.46 72.01 494.2 72.01 466.97 120.1 466.97 120.14 431.45 182.85 490.22 182.85 451.79 251.21 314.66 251.21 349.88 189.04 349.88 189 353.36 182.85 353.39 182.85 378.44 138.57 416.14 72.01 427.94 51.14 456.87 0 700.22 0" />
    </svg>
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
    "group inline-flex items-center justify-center gap-3 px-7 py-4 text-[12px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 rounded-full";
  const variants: Record<string, string> = {
    ice: "bg-[var(--ice)] text-[var(--night)] hover:bg-[var(--deep)] hover:text-[var(--ice)]",
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
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

/* -------------------- Nav -------------------- */
function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-x flex items-center justify-between pt-6 md:pt-8">
        <a href="#top" className="flex items-center gap-3 text-[var(--ice)]">
          <MCMark className="h-9 w-9 text-[var(--ice)]" />
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
  const headline = [
    "Nutrição para quem cansou",
    "de começar do zero",
    "toda segunda-feira.",
  ];
  return (
    <section
      id="top"
      className="relative bg-[var(--night)] text-[var(--ice)] pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden"
    >
      <Nav />

      {/* Watermark MC */}
      <MCMark
        aria-hidden
        className="pointer-events-none select-none absolute -right-16 -bottom-24 h-[560px] w-[560px] text-[var(--ice)]/[0.035]"
      />

      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end relative">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
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
                  transition={{ duration: 0.95, delay: 0.15 + i * 0.12, ease }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 max-w-xl text-base md:text-lg text-[var(--mute)] leading-relaxed"
          >
            Acompanhamento individualizado para transformar sua alimentação, sua rotina e seu resultado no corpo — sem terrorismo nutricional, sem plano genérico e sem exigir uma vida perfeita.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
          >
            <Cta>Agendar avaliação pelo WhatsApp</Cta>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--mute)] font-display font-semibold">
              Emagrecimento · Hipertrofia · Recomposição · Rotina real
            </p>
          </motion.div>
        </div>

        {/* Right column: typographic portrait slot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="lg:col-span-5 relative"
        >
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, delay: 0.5, ease }}
            className="relative aspect-[4/5] bg-[var(--deep)] border border-[var(--ice)]/10 overflow-hidden"
          >
            {/* Layered MC composition stands in for the real photo until it's provided */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--deep)] via-[var(--petrol)] to-[var(--nearblack)]" />
            <MCMark
              aria-hidden
              className="absolute inset-0 m-auto h-[78%] w-[78%] text-[var(--ice)]/15"
            />
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/60 font-display font-semibold">
              <span>Mat. Correia</span>
              <span>Portrait · 01</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <p className="font-display font-extrabold text-[var(--ice)] leading-none tracking-[-0.04em] text-4xl md:text-5xl">
                MC<span className="text-[var(--mute)]">/</span>26
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--ice)]/60 font-display font-semibold max-w-[10rem] text-right">
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
        <p className="eyebrow text-[var(--mute)] md:whitespace-nowrap">Aprofundamento</p>
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
  const lines = [
    "Você até começa bem.",
    "Mas a rotina te engole.",
    "Você sabe o que tem que fazer.",
    "Mas não consegue sustentar.",
    "Você não falha porque gosta de comer.",
    "Você falha porque o plano não foi feito para a sua vida.",
  ];
  return (
    <section className="relative bg-[var(--nearblack)] text-[var(--ice)] py-28 md:py-40 overflow-hidden">
      <MCMark
        aria-hidden
        className="pointer-events-none select-none absolute -left-24 top-1/2 -translate-y-1/2 h-[640px] w-[640px] text-[var(--ice)]/[0.025]"
      />
      <div className="container-x relative">
        <div className="flex items-center gap-3 mb-12">
          <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">02 — Identificação</p>
        </div>

        <div className="max-w-4xl space-y-2 md:space-y-3">
          {lines.map((line, i) => (
            <motion.h2
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
              className={`font-display font-extrabold text-3xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.035em] ${
                i % 2 === 1 ? "text-[var(--mute)] pl-6 md:pl-16" : "text-[var(--ice)]"
              }`}
            >
              {line}
            </motion.h2>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="mt-24 md:mt-36 border-t border-[var(--ice)]/15 pt-12 md:pt-16"
        >
          <p className="eyebrow text-[var(--mute)] mb-6">Tese</p>
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
  return (
    <section className="bg-[var(--deep)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--ice)]/40" />
            <p className="eyebrow text-[var(--mute)]">03 — Individualidade</p>
          </div>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.0] tracking-[-0.04em]"
          >
            O acompanhamento não começa com um cardápio.
            <span className="block text-[var(--mute)]">Começa entendendo você.</span>
          </motion.h2>
        </div>
        <div className="lg:col-span-7 lg:pl-12 lg:border-l border-[var(--ice)]/15">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-lg md:text-xl text-[var(--ice)] leading-relaxed"
          >
            Sua rotina, seus horários, seu treino, sua fome, suas preferências, suas dificuldades e o que já falhou antes.
          </motion.p>

          <motion.h3
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12 font-display font-bold text-2xl md:text-3xl tracking-[-0.03em]"
          >
            Sua rotina é única.
            <span className="block text-[var(--mute)]">Seu plano alimentar também precisa ser.</span>
          </motion.h3>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 text-base md:text-lg text-[var(--mute)] leading-relaxed max-w-2xl"
          >
            O trabalho do Matheus Correia é construir um plano alimentar com estratégia — não uma dieta perfeita no papel. Um plano que encaixa comida de verdade, preferências, ajustes e protocolo para você continuar evoluindo sem viver no ciclo de começa na segunda e desiste na sexta.
          </motion.p>
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
    <section id="metodo" className="bg-[var(--night)] text-[var(--ice)] relative overflow-hidden">
      <MCMark
        aria-hidden
        className="pointer-events-none select-none absolute -left-32 -top-32 h-[480px] w-[480px] text-[var(--ice)]/[0.03]"
      />
      <div className="container-x pt-24 md:pt-32 pb-8 md:pb-14 relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-[var(--ice)]/40" />
          <p className="eyebrow text-[var(--mute)]">04 — Método</p>
        </div>
        <p className="font-display font-semibold text-xs md:text-sm uppercase tracking-[0.24em] text-[var(--mute)]">
          Flexível não significa sem método. / Rígido não significa eficiente.
        </p>
        <h2 className="mt-6 font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-[-0.045em] leading-[0.98] max-w-4xl">
          Um plano feito para sair do papel.
        </h2>
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
function TrainingNutrition() {
  return (
    <section className="bg-[var(--nearblack)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Typographic block stands in for real photo */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="lg:col-span-6 order-2 lg:order-1 relative aspect-[5/4] bg-[var(--deep)] border border-[var(--ice)]/10 overflow-hidden p-8 flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--nearblack)] via-[var(--deep)] to-[var(--nearblack)]" />
          <MCMark
            aria-hidden
            className="absolute -right-12 -bottom-12 h-72 w-72 text-[var(--ice)]/[0.06]"
          />
          <div className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[var(--ice)]/70 font-display font-semibold">
            <span>Frame 02</span>
            <span>Treino / Nutrição</span>
          </div>
          <div className="relative">
            <p className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.045em] text-[var(--ice)]">
              Estímulo<br />
              <span className="text-[var(--mute)]">+</span><br />
              Resultado
            </p>
          </div>
        </motion.div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--ice)]/40" />
            <p className="eyebrow text-[var(--mute)]">05 — Treino + Nutrição</p>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.045em]">
            A academia constrói <span className="text-[var(--mute)]">o estímulo.</span>
            <span className="block">A nutrição constrói o resultado.</span>
          </h2>
          <p className="mt-8 text-[var(--mute)] text-lg leading-relaxed max-w-xl">
            Se você já está fazendo esforço na academia, sua alimentação precisa trabalhar junto. A nutrição organiza energia, proteína, recuperação e consistência para esse esforço aparecer no corpo.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Real Life -------------------- */
function RealLife() {
  return (
    <section className="bg-[var(--icebg)] text-[var(--night)] py-24 md:py-32">
      <div className="container-x">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-[var(--night)]/30" />
          <p className="eyebrow text-[var(--night)]/60">06 — Vida real</p>
        </div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.045em] text-[var(--night)] max-w-5xl"
        >
          Hambúrguer, chocolate e vida social não precisam ser{" "}
          <span className="text-[var(--night)]/50">o fim do seu resultado.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7 space-y-6 text-[var(--night)] text-lg leading-relaxed max-w-2xl">
            <p>O problema não é uma refeição fora do plano. O problema é não ter estratégia para lidar com ela.</p>
            <p className="text-[var(--night)]/60">
              Um plano bem construído não te obriga a apagar tudo que você gosta. Ele organiza quantidade, frequência, contexto e ajustes para que sua alimentação tenha liberdade sem virar bagunça.
            </p>
          </div>
          <div className="md:col-span-5 md:pl-10 md:border-l border-[var(--night)]/20">
            <h3 className="font-display font-extrabold text-3xl md:text-4xl tracking-[-0.04em]">
              O plano certo não te prende.
              <span className="block text-[var(--night)]/60">Ele te dá direção.</span>
            </h3>
          </div>
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
  { t: "Acompanhamento online", d: "Atendimento à distância com ajustes regulares." },
  { t: "Rotina real", d: "Plano que cabe em quem trabalha, treina e vive." },
];

function Services() {
  return (
    <section
      id="servicos"
      className="bg-[var(--night)] text-[var(--ice)] border-t border-[var(--ice)]/10 py-24 md:py-32"
    >
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--ice)]/40" />
            <p className="eyebrow text-[var(--mute)]">07 — Serviços + Sobre</p>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-[-0.045em] leading-[0.98]">
            Um trabalho,<br />vários objetivos.
          </h2>
          <p className="mt-6 text-[var(--mute)] text-base leading-relaxed max-w-md">
            Matheus Correia une prática clínica, vivência no treino e atualização constante no universo fitness para construir planos que não existem só no papel.
          </p>
          <div className="mt-8 inline-flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--mute)] font-display font-semibold border border-[var(--ice)]/15 rounded-lg px-5 py-4">
            <span>Nutricionista</span>
            <span>Atendimento presencial / online</span>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group border border-[var(--ice)]/12 bg-[var(--deep)] hover:bg-[var(--petrol)] hover:border-[var(--ice)]/35 transition-colors p-6 rounded-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display font-bold text-xl md:text-2xl tracking-[-0.03em]">
                  {s.t}
                </h3>
                <span className="text-[10px] tabular-nums text-[var(--mute)] font-display font-semibold tracking-[0.2em] group-hover:text-[var(--ice)] transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--mute)] leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
            <p className="eyebrow text-[var(--mute)]">08 — Perguntas</p>
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
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -bottom-32 h-[680px] w-[680px] text-[var(--ice)]/[0.03]"
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
          <MCMark className="h-7 w-7 text-[var(--ice)]" />
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
