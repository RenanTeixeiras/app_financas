import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finanças Pessoais",
    short_name: "Finanças",
    description: "Controle premium de receitas e despesas para uso diário.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#08101b",
    theme_color: "#08101b",
    lang: "pt-BR",
  };
}
