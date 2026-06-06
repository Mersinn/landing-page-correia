import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const VIDEO_LABEL = "Arnold Sports Festival · South America 2026";
const BAG_LABEL = "Fala Nutri";
const BAG_ALT = "Comida de verdade — rotina alimentar com estratégia";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/* Treino + Nutrição — mídia com expansão por scroll (adaptado do ScrollExpandMedia).
 *
 * Storytelling: a FOTO (comida/rotina) é o plano de fundo; o VÍDEO (Arnold) começa
 * pequeno e EXPANDE conforme você rola, virando a peça dominante; depois o scroll
 * desce e revela o TEXTO/copy abaixo.
 *
 * Implementação determinística: o progresso do scroll local (sticky) vira um número
 * em estado (padrão do Method), e todos os estilos são calculados como números puros —
 * sem motion-values em opacidade (que se mostraram instáveis aqui).
 *
 * Sem hijack de scroll, sem preventDefault/window.scrollTo, sem listener global, sem
 * Next/Image, sem dependência nova, sem controls/áudio. O <video> mantém autoPlay/muted/
 * loop/playsInline/preload=metadata/poster.
 *
 * REQUISITO: nenhum ancestral pode ter overflow-hidden (senão o sticky morre). */
export function TrainingMediaStage({
  videoSrc,
  posterSrc,
  bagSrc,
}: {
  videoSrc: string;
  posterSrc: string;
  bagSrc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [raw, setRaw] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setRaw(v));

  /* prefers-reduced-motion: mostra o vídeo já expandido, estático. */
  const p = prefersReduced ? 1 : raw;

  /* Expansão do vídeo concentrada em [0, 0.62]; depois segura até soltar o sticky. */
  const e = clamp01(p / 0.62);
  const videoScale = 0.52 + e * 0.48; // 0.52 → 1.0
  const videoRadius = 26 - e * 16; // 26px → 10px
  const overlay = 0.5 - e * 0.32; // escurecimento do vídeo afina
  const bgScale = 1.16 - e * 0.12; // fundo recua de leve
  const bgDim = 0.42 + e * 0.3; // fundo escurece conforme o vídeo domina
  const bgBlur = e * 16; // fundo nítido no início → desfocado (vídeo vira herói)
  const bagLabelOp = clamp01(1 - e * 1.4); // label do fundo some cedo
  const videoLabelOp = clamp01((p - 0.14) / 0.22); // label do vídeo entra
  const hintOp = clamp01(1 - p / 0.12); // dica some logo no início
  const kickerOp = clamp01(1 - e * 1.2); // kicker some conforme expande

  return (
    <section className="relative bg-[var(--nearblack)] text-[var(--ice)] border-t border-[var(--ice)]/10">
      {/* Bloco alto = espaço de scroll para a expansão acontecer */}
      <div ref={ref} className="relative" style={{ height: "230vh" }}>
        {/* Palco fixo */}
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          {/* Fundo: foto da sacola (Fala Nutri) */}
          <img
            src={bagSrc}
            alt={BAG_ALT}
            draggable={false}
            style={{ transform: `scale(${bgScale})`, filter: bgBlur > 0.5 ? `blur(${bgBlur}px)` : undefined }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-[var(--night)]" style={{ opacity: bgDim }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--nearblack)] via-transparent to-[var(--nearblack)]/40" />

          {/* Label do fundo (foto) */}
          <div
            style={{ opacity: bagLabelOp }}
            className="pointer-events-none absolute bottom-6 left-0 right-0 z-10"
          >
            <div className="container-x flex items-center gap-2 text-[10px] font-display font-semibold uppercase tracking-[0.24em] text-[var(--ice)]/80">
              <span className="h-px w-6 bg-[var(--ice)]/50" />
              {BAG_LABEL}
            </div>
          </div>

          {/* Kicker */}
          <div
            style={{ opacity: kickerOp }}
            className="pointer-events-none absolute top-6 left-0 right-0 z-20"
          >
            <div className="container-x flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--ice)]/40" />
              <p className="eyebrow text-[var(--ice)]/70">Treino + Nutrição</p>
            </div>
          </div>

          {/* Vídeo que expande */}
          <div
            style={{ transform: `scale(${videoScale})`, borderRadius: `${videoRadius}px` }}
            className="relative z-10 aspect-[9/16] h-[58svh] overflow-hidden border border-[var(--ice)]/12 bg-[var(--deep)] shadow-2xl will-change-transform lg:h-[82svh]"
          >
            <video
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              style={{ opacity: overlay }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--night)]/70 via-[var(--night)]/10 to-transparent"
            />
            <div
              style={{ opacity: videoLabelOp }}
              className="pointer-events-none absolute top-4 left-4 right-4 flex items-center gap-2 text-[10px] font-display font-semibold uppercase tracking-[0.24em] text-[var(--ice)]/90 md:text-[11px]"
            >
              <span className="h-px w-6 bg-[var(--ice)]/60" />
              {VIDEO_LABEL}
            </div>
          </div>

          {/* Dica de scroll */}
          <div
            style={{ opacity: hintOp }}
            className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-2 text-[10px] font-display font-semibold uppercase tracking-[0.3em] text-[var(--ice)]/70"
          >
            role para expandir
            <span className="text-base">↓</span>
          </div>
        </div>
      </div>

      {/* Texto / copy — entra no fluxo normal depois do palco */}
      <div className="container-x pb-24 md:pb-32 pt-2 md:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease }}
          className="max-w-4xl"
        >
          <h2 className="font-display font-extrabold text-[34px] leading-[0.98] tracking-[-0.045em] text-balance md:text-5xl lg:text-[60px]">
            A academia constrói <span className="text-[var(--mute)]">o estímulo.</span>
            <span className="block">A dieta constrói o resultado.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--ice)]/85 md:text-lg">
            Se você já faz esforço na academia, sua alimentação precisa trabalhar junto — organizando energia, performance e recuperação para esse esforço se refletir na sua evolução.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
