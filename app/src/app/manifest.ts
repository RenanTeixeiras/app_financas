import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finanças Pessoais",
    short_name: "Finanças",
    description: "Controle premium de receitas e despesas para uso diário.",
    start_url: "/dashboard",
    id: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#08101b",
    theme_color: "#08101b",
    lang: "pt-BR",
    categories: ["finance", "productivity", "business"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
