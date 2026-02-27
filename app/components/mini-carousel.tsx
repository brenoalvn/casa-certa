"use client";

import { useMemo, useState } from "react";

type Img = { url: string; is_cover?: boolean };

export function MiniCarousel({
  images,
  title,
}: {
  images?: Img[];
  title: string;
}) {
  const imgs = useMemo(() => {
    const safe = (images ?? []).filter((x) => !!x.url);
    // capa primeiro
    safe.sort((a, b) => Number(!!b.is_cover) - Number(!!a.is_cover));
    // evita carrossel gigante na home
    return safe.slice(0, 6);
  }, [images]);

  const [idx, setIdx] = useState(0);

  const hasMany = imgs.length > 1;
  const current = imgs[idx]?.url;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((v) => (v - 1 + imgs.length) % imgs.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((v) => (v + 1) % imgs.length);
  };

  const goTo = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(i);
  };

  if (!current) return null;

  return (
    <div className="relative h-full w-full">
      <img
        src={current}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {/* setas só se tiver mais de 1 */}
      {hasMany && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm hover:bg-white"
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm hover:bg-white"
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}

      {/* bolinhas */}
      {hasMany && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {imgs.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={goTo(i)}
              className={`h-2 w-2 rounded-full border ${
                i === idx ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Ir para imagem ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}