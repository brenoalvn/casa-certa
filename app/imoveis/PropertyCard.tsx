import Link from "next/link";

type Property = {
  id: string;
  title: string | null;
  slug: string;
  purpose: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  total_area: number | null;
  city: string | null;
  neighborhood: string | null;
  featured: boolean | null;
};

export default function PropertyCard({ p }: { p: Property }) {
  const price =
    typeof p.price === "number"
      ? p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "Consultar";

  const purposeLabel =
    (p.purpose ?? "").toLowerCase() === "aluguel" ? "Aluguel" : "Venda";

  return (
    <Link
      href={`/imoveis/${p.slug}`}
      className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-sm"
    >
      {/* Imagem placeholder (igual protótipo) */}
      <div className="relative aspect-[4/3] bg-neutral-200">
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
            {purposeLabel}
          </span>
        </div>

        {p.featured ? (
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              Destaque
            </span>
          </div>
        ) : null}

        <div className="flex h-full items-center justify-center text-neutral-400">
          <span className="text-3xl">🖼️</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <div className="font-serif text-xl font-semibold text-emerald-800">
          {price}
        </div>

        <div className="mt-1 font-serif text-base font-semibold text-zinc-900">
          {p.title ?? p.slug}
        </div>

        <div className="mt-1 text-sm text-zinc-600">
          {p.neighborhood ? `${p.neighborhood}, ` : ""}
          {p.city ?? ""}
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-zinc-600">
          {typeof p.bedrooms === "number" ? <span>🛏️ {p.bedrooms}</span> : null}
          {typeof p.bathrooms === "number" ? <span>🛁 {p.bathrooms}</span> : null}
          {typeof p.parking_spots === "number" ? (
            <span>🚗 {p.parking_spots}</span>
          ) : null}
          {typeof p.total_area === "number" ? (
            <span>📐 {p.total_area}m²</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}