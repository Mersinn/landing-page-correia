import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import heroImg from "@/assets/hero-matheus.jpg";
import foodImg from "@/assets/food-real.jpg";
import trainingImg from "@/assets/training.jpg";

const WHATSAPP = "https://wa.me/message/K5WYIUI5FXYFE1";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Cta({
  variant = "lime",
  children,
  className = "",
}: {
  variant?: "lime" | "outline" | "ghostDark";
  children: React.ReactNode;
  className?: string;
}) {
  const base =
    "group inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 rounded-full";
  const variants: Record<string, string> = {
    lime:
      "bg-[var(--lime)] text-[var(--night)] hover:bg-[var(--night)] hover:text-[var(--lime)]",
    outline:
      "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)]",
    ghostDark:
      "border border-[var(--cream)]/30 text-[var(--cream)] hover:bg-[var(--lime)] hover:text-[var(--night)] hover:border-[var(--lime)]",
  };
  return (
    <a href={WHATSAPP} target="_blank" rel="noreferrer" className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-x flex items-center justify-between pt-6 md:pt-8">
        <a href="#top" className="font-display text-lg tracking-tight text-[var(--ink)]">
          Matheus Correia<span className="text-[var(--olive)]">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
          <a href="#metodo" className="hover:text-[var(--ink)]">Método</a>
          <a href="#servicos" className="hover:text-[var(--ink)]">Serviços</a>
          <a href="#faq" className="hover:text-[var(--ink)]">FAQ</a>
        </nav>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] border border-[var(--ink)] rounded-full px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors"
        >
          Agendar <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const headline = [
    "Nutrição para quem cansou",
    "de começar do zero",
    "toda segunda-feira.",
  ];
  return (
    <section id="top" className="relative bg-[var(--cream)] pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <Nav />
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-8"
          >
            ● Routine Performance — Nutrição Clínica
          </motion.p>
          <h1 className="font-display text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[88px] tracking-[-0.03em] text-[var(--ink)]">
            {headline.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-8 max-w-xl text-base md:text-lg text-[var(--ink-soft)] leading-relaxed"
          >
            Acompanhamento individualizado para transformar sua alimentação, sua rotina e seu resultado no corpo — sem terrorismo nutricional, sem plano genérico e sem exigir uma vida perfeita.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <Cta>Agendar avaliação pelo WhatsApp</Cta>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
              Emagrecimento · Hipertrofia · Recomposição · Rotina real
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.img
              src={heroImg}
              alt="Matheus Correia, nutricionista"
              width={1280}
              height={1600}
              className="h-full w-full object-cover"
              initial={{ scale: 1.15, clipPath: "inset(100% 0 0 0)" }}
              animate={{ scale: 1, clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[var(--cream)] mix-blend-difference">
              <span>Matheus Correia</span>
              <span>Nutri · CRN —</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-x mt-16 md:mt-24 border-t border-[var(--rule)] pt-6 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">
        <span>Resultado sem terrorismo</span>
        <span>Flexibilidade com protocolo</span>
        <span>Treino com nutrição</span>
        <span className="hidden md:inline">Estratégia no lugar da culpa</span>
      </div>
    </section>
  );
}

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
    <section className="bg-[var(--cream)] py-24 md:py-36">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <p className="eyebrow mb-6">02 — Identificação</p>
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] overflow-hidden"
          >
            <img
              src={foodImg}
              alt="Hambúrguer e chocolate — comida real"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            <span className="text-[var(--gold)]">●</span> Comer não é o problema.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-3 md:space-y-4">
            {lines.map((line, i) => (
              <motion.h2
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em] ${
                  i % 2 === 1 ? "text-[var(--ink-soft)]" : "text-[var(--ink)]"
                }`}
              >
                {line}
              </motion.h2>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 border-t border-[var(--rule)] pt-10"
          >
            <p className="eyebrow mb-4">Tese</p>
            <h3 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
              Você não precisa de culpa.
              <br />
              Precisa de <em className="not-italic relative inline-block">
                estratégia.
                <span className="absolute left-0 -bottom-1 h-[6px] w-full bg-[var(--lime)]/70 -z-0" aria-hidden />
              </em>
            </h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Positioning() {
  return (
    <section className="bg-[var(--cream)] border-t border-[var(--rule)] py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">03 — Individualidade</p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] text-[var(--ink)]"
          >
            O acompanhamento não começa com um cardápio.
            <span className="block text-[var(--ink-soft)]">Começa entendendo você.</span>
          </motion.h2>
        </div>
        <div className="lg:col-span-7 lg:pl-12 lg:border-l border-[var(--rule)]">
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-lg md:text-xl text-[var(--ink)] leading-relaxed">
            Sua rotina, seus horários, seu treino, sua fome, suas preferências, suas dificuldades e o que já falhou antes.
          </motion.p>

          <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10 font-display text-2xl md:text-3xl tracking-[-0.02em] text-[var(--ink)]">
            Sua rotina é única.
            <span className="block text-[var(--olive)]">Seu plano alimentar também precisa ser.</span>
          </motion.h3>

          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 text-base md:text-lg text-[var(--ink-soft)] leading-relaxed max-w-2xl">
            O trabalho do Matheus Correia é construir um plano alimentar com estratégia — não uma dieta perfeita no papel. Um plano que encaixa comida de verdade, preferências, ajustes e protocolo para você continuar evoluindo sem viver no ciclo de começa na segunda e desiste na sexta.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

const METHOD_STEPS = [
  {
    n: "01",
    title: "Entender sua rotina",
    text: "Antes de montar o plano, é preciso entender como você vive, treina, come e onde normalmente desiste.",
  },
  {
    n: "02",
    title: "Definir o objetivo real",
    text: "Emagrecer, ganhar massa ou recompor o corpo exigem estratégias diferentes.",
  },
  {
    n: "03",
    title: "Construir uma alimentação possível",
    text: "Comida de verdade, preferências, flexibilidade e protocolo.",
  },
  {
    n: "04",
    title: "Ajustar antes de você abandonar",
    text: "O acompanhamento corrige rota antes que a rotina vire desculpa para desistir.",
  },
];

function Method() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, METHOD_STEPS.length - 0.0001]);
  const [active, setActive] = useState(0);
  activeIndex.on("change", (v) => setActive(Math.min(METHOD_STEPS.length - 1, Math.floor(v))));

  return (
    <section id="metodo" className="bg-[var(--night)] text-[var(--cream)]">
      <div className="container-x pt-24 md:pt-32 pb-8 md:pb-12">
        <p className="eyebrow text-[var(--cream)]/60 mb-6">04 — Método</p>
        <p className="font-display text-sm md:text-base uppercase tracking-[0.2em] text-[var(--lime)]">
          Flexível não significa sem método. / Rígido não significa eficiente.
        </p>
        <h2 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl tracking-[-0.02em] leading-[1.02] max-w-4xl">
          Um plano feito para sair do papel.
        </h2>
      </div>

      {/* Desktop sticky scroll */}
      <div ref={containerRef} className="hidden lg:block relative" style={{ height: `${METHOD_STEPS.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="container-x grid grid-cols-12 gap-12 w-full">
            <div className="col-span-5 flex items-center">
              <div className="font-display text-[18rem] leading-none tracking-[-0.05em] text-[var(--lime)] tabular-nums">
                <motion.span key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block">
                  {METHOD_STEPS[active].n}
                </motion.span>
              </div>
            </div>
            <div className="col-span-7 space-y-10">
              {METHOD_STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  animate={{ opacity: i === active ? 1 : 0.25, x: i === active ? 0 : -8 }}
                  transition={{ duration: 0.5 }}
                  className="border-t border-[var(--cream)]/15 pt-6"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--cream)]/50">Etapa {step.n}</p>
                  <h3 className="mt-3 font-display text-3xl xl:text-4xl tracking-[-0.02em] text-[var(--cream)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[var(--cream)]/70 max-w-xl leading-relaxed">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/tablet stacked */}
      <div className="lg:hidden container-x pb-24 space-y-8">
        {METHOD_STEPS.map((step) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="border-t border-[var(--cream)]/15 pt-6"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl text-[var(--lime)] tabular-nums">{step.n}</span>
              <h3 className="font-display text-2xl tracking-[-0.02em]">{step.title}</h3>
            </div>
            <p className="mt-3 text-[var(--cream)]/70 leading-relaxed">{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TrainingNutrition() {
  return (
    <section className="bg-[var(--night)] text-[var(--cream)] border-t border-[var(--cream)]/10 py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="lg:col-span-6 aspect-[5/4] overflow-hidden order-2 lg:order-1"
        >
          <img src={trainingImg} alt="Treino" loading="lazy" width={1400} height={1000} className="h-full w-full object-cover grayscale-[0.2]" />
        </motion.div>
        <div className="lg:col-span-6 order-1 lg:order-2">
          <p className="eyebrow text-[var(--cream)]/60 mb-6">05 — Treino + Nutrição</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.02em]">
            A academia constrói <span className="text-[var(--cream)]/50">o estímulo.</span>
            <span className="block">A nutrição constrói <span className="text-[var(--lime)]">o resultado.</span></span>
          </h2>
          <p className="mt-8 text-[var(--cream)]/70 text-lg leading-relaxed max-w-xl">
            Se você já está fazendo esforço na academia, sua alimentação precisa trabalhar junto. A nutrição organiza energia, proteína, recuperação e consistência para esse esforço aparecer no corpo.
          </p>
        </div>
      </div>
    </section>
  );
}

function RealLife() {
  return (
    <section className="bg-[var(--cream)] py-24 md:py-32">
      <div className="container-x">
        <p className="eyebrow mb-6"><span className="text-[var(--gold)]">●</span> 06 — Vida real</p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em] text-[var(--ink)] max-w-5xl"
        >
          Hambúrguer, chocolate e vida social não precisam ser{" "}
          <span className="text-[var(--gold)]">o fim do seu resultado.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7 space-y-6 text-[var(--ink)] text-lg leading-relaxed max-w-2xl">
            <p>O problema não é uma refeição fora do plano. O problema é não ter estratégia para lidar com ela.</p>
            <p className="text-[var(--ink-soft)]">
              Um plano bem construído não te obriga a apagar tudo que você gosta. Ele organiza quantidade, frequência, contexto e ajustes para que sua alimentação tenha liberdade sem virar bagunça.
            </p>
          </div>
          <div className="md:col-span-5 md:pl-10 md:border-l border-[var(--rule)]">
            <h3 className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-[var(--ink)]">
              O plano certo não te prende.
              <span className="block text-[var(--olive)]">Ele te dá direção.</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section id="servicos" className="bg-[var(--cream)] border-t border-[var(--rule)] py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">07 — Serviços + Sobre</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ink)] leading-[1.05]">
            Um trabalho, vários objetivos.
          </h2>
          <p className="mt-6 text-[var(--ink-soft)] text-base leading-relaxed max-w-md">
            Matheus Correia une prática clínica, vivência no treino e atualização constante no universo fitness para construir planos que não existem só no papel.
          </p>
          <div className="mt-8 inline-flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)] border border-[var(--rule)] rounded-2xl px-5 py-4">
            <span>Nutricionista · CRN —</span>
            <span>Atendimento presencial / online</span>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group border border-[var(--rule)] bg-[var(--cream)] hover:bg-white hover:border-[var(--ink)] transition-colors p-6 rounded-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl md:text-2xl tracking-[-0.02em] text-[var(--ink)]">{s.t}</h3>
                <span className="text-xs tabular-nums text-[var(--ink-soft)] group-hover:text-[var(--lime)] transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section id="faq" className="bg-[var(--cream)] border-t border-[var(--rule)] py-24 md:py-32">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">08 — Perguntas</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ink)] leading-[1.05]">
            Antes da primeira consulta.
          </h2>
        </div>
        <div className="lg:col-span-8">
          <div className="border-t border-[var(--ink)]/80">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-[var(--ink)]/80">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg md:text-2xl tracking-[-0.01em] text-[var(--ink)]">
                      {f.q}
                    </span>
                    <span className={`text-2xl text-[var(--ink)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-10 text-[var(--ink-soft)] leading-relaxed max-w-2xl">{f.a}</p>
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

function FinalCta() {
  return (
    <section className="bg-[var(--night)] text-[var(--cream)] py-28 md:py-40">
      <div className="container-x text-center max-w-5xl mx-auto">
        <p className="eyebrow text-[var(--lime)] mb-8">● Comece</p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] tracking-[-0.03em]"
        >
          Pare de recomeçar toda segunda.
          <span className="block text-[var(--cream)]/60">
            Comece a seguir um plano feito para você continuar.
          </span>
        </motion.h2>
        <p className="mt-10 text-[var(--cream)]/70 max-w-2xl mx-auto text-lg leading-relaxed">
          Transforme sua alimentação, sua rotina e seu resultado com um acompanhamento individualizado — sem culpa, sem terrorismo nutricional e sem dieta genérica.
        </p>
        <div className="mt-12 flex justify-center">
          <Cta variant="lime" className="text-base px-9 py-5">
            Falar com Matheus no WhatsApp
          </Cta>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--night)] text-[var(--cream)]/60 border-t border-[var(--cream)]/10">
      <div className="container-x py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
        <span>© {new Date().getFullYear()} Matheus Correia · Nutrição</span>
        <span>Routine Performance</span>
        <a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-[var(--lime)]">
          WhatsApp →
        </a>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <main className="bg-[var(--cream)] text-[var(--ink)] selection:bg-[var(--lime)] selection:text-[var(--night)]">
      <Hero />
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