"use client";

import { useMemo, useState } from "react";

type Img = { url: string; is_cover?: boolean | null };

export function GalleryCarousel({
  images,
  title,
}: {
  images: Img[] | null | undefined;
  title: string;
}) {
  const list = useMemo(() => {
    const arr = (images ?? []).filter((i) => !!i?.url);

    // capa primeiro
    arr.sort((a, b) => Number(!!b.is_cover) - Number(!!a.is_cover));

    // remove duplicados por url
    const seen = new Set<string>();
    return arr.filter((x) => (seen.has(x.url) ? false : (seen.add(x.url), true)));
  }, [images]);

  const [idx, setIdx] = useState(0);

  const hasMany = list.length > 1;
  const current = list[idx]?.url;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMany) return;
    setIdx((v) => (v - 1 + list.length) % list.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMany) return;
    setIdx((v) => (v + 1) % list.length);
  };

  if (!current) {
    return (
      <div className="flex h-full w-full items-center justify-center text-neutral-400">
        <div className="rounded-full border border-neutral-300 bg-white/70 px-4 py-2 text-sm">
          Sem imagem cadastrada
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <img src={current} alt={title} className="h-full w-full object-cover" />

      {hasMany && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-white hover:bg-black/60"
            aria-label="Imagem anterior"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-white hover:bg-black/60"
            aria-label="Próxima imagem"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`h-2 w-2 rounded-full ${
                  i === idx ? "bg-white" : "bg-white/45"
                }`}
                aria-label={`Ir para imagem ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}