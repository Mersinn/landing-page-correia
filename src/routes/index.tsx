import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matheus Correia — Nutrição para quem cansou de começar do zero" },
      { name: "description", content: "Acompanhamento nutricional individualizado para treino, rotina real e resultado no corpo. Sem terrorismo, sem dieta genérica." },
      { property: "og:title", content: "Matheus Correia — Nutrição de resultado, treino e rotina real" },
      { property: "og:description", content: "Plano alimentar que cabe na sua rotina e ainda leva a resultado. Estratégia no lugar da culpa." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/matheus-arnold.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/matheus-arnold.jpg" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
