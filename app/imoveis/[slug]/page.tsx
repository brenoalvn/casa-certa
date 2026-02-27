import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/server";
import { GalleryCarousel } from "./components/gallery-carousel";


type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ImovelDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = supabaseServer;

  const { data: imovel, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !imovel) notFound();

  // Se sua tabela for property_images e tiver property_id/url/ordem, ok.
  // Se o nome/colunas forem diferentes, me manda um print dela.
  // ✅ TABELA CERTA + COLUNAS CERTAS (sem "ordem")
  const { data: imagens, error: imgErr } = await supabase
    .from("property_images")
    .select("url, is_cover, created_at")
    .eq("property_id", imovel.id)
    .order("is_cover", { ascending: false }) // capa primeiro
    .order("created_at", { ascending: true });

    if (imgErr) {
    // se quiser, pode logar imgErr.message
  }

  const primeiraImagem = imagens?.[0]?.url;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Imagem / Galeria */}
        <section className="overflow-hidden rounded-2xl border bg-white">
          <div className="aspect-[16/9] w-full bg-neutral-100">
  <GalleryCarousel
    images={imagens ?? []}
    title={imovel.title ?? imovel.slug}
  />
</div>

          <div className="p-6">
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {imovel.type ? (
                <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                  {imovel.type}
                </span>
              ) : null}

              {imovel.purpose ? (
                <span className="rounded-full border px-3 py-1 text-xs font-semibold">
                  {imovel.purpose}
                </span>
              ) : null}

              {imovel.status ? (
                <span className="rounded-full border px-3 py-1 text-xs font-semibold">
                  {imovel.status}
                </span>
              ) : null}
            </div>

            {/* Título */}
            <h1 className="mt-4 text-3xl font-semibold">{imovel.title}</h1>

            {/* Preço */}
            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {typeof imovel.price === "number"
                ? imovel.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : imovel.price}
            </p>

            {/* Local */}
            <p className="mt-2 text-sm text-neutral-600">
              {imovel.neighborhood ? `${imovel.neighborhood}, ` : ""}
              {imovel.city ?? ""}
            </p>

            {/* Cards principais */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-600">Quartos</div>
                <div className="text-lg font-semibold">
                  {imovel.bedrooms ?? "—"}
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-600">Banheiros</div>
                <div className="text-lg font-semibold">
                  {imovel.bathrooms ?? "—"}
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-600">Vagas</div>
                <div className="text-lg font-semibold">
                  {imovel.parking_spots ?? "—"}
                </div>
              </div>
            </div>

            {/* Áreas (igual ao protótipo) */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-600">Área construída</div>
                <div className="text-lg font-semibold">
                  {imovel.built_area ? `${imovel.built_area}m²` : "—"}
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-600">Área total</div>
                <div className="text-lg font-semibold">
                  {imovel.total_area ? `${imovel.total_area}m²` : "—"}
                </div>
              </div>
            </div>

            {/* Descrição */}
            {imovel.description ? (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Descrição</h2>
                <p className="mt-2 whitespace-pre-line text-neutral-700">
                  {imovel.description}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Card Interessado */}
        <aside className="h-fit rounded-2xl border bg-white p-6">
          <h3 className="text-2xl font-semibold">Interessado?</h3>

          <a
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white"
            href={`https://wa.me/55SEUNUMEROAQUI?text=${encodeURIComponent(
              `Olá! Tenho interesse no imóvel: ${imovel.title ?? imovel.slug}`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

          <button className="mt-3 w-full rounded-xl border px-4 py-3 font-semibold">
            Solicitar detalhes
          </button>
        </aside>
      </div>
    </main>
  );
}