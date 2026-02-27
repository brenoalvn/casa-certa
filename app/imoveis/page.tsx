import { supabaseServer } from "@/lib/server";
import ImoveisFilters from "./ImoveisFilters";
import PropertyCard from "./PropertyCard";

type SearchParams = {
  q?: string;
  type?: string;     // ex: apto, casa, terreno
  purpose?: string;  // ex: venda, aluguel
  sort?: string;     // recent | price_asc | price_desc
};

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const supabase = supabaseServer;

  const q = (sp.q ?? "").trim();
  const type = (sp.type ?? "").trim();
  const purpose = (sp.purpose ?? "").trim();
  const sort = (sp.sort ?? "recent").trim();

  let query = supabase
    .from("properties")
    .select(
      "id, title, slug, type, purpose, price, bedrooms, bathrooms, parking_spots, total_area, city, neighborhood, featured, status"
    );

  if (type && type !== "all") query = query.eq("type", type);
  if (purpose && purpose !== "all") query = query.eq("purpose", purpose);

  // Busca simples: título / cidade / bairro (ilike funciona no Postgres)
  if (q) {
    const safe = q.replace(/%/g, "\\%").replace(/_/g, "\\_");
    query = query.or(
      `title.ilike.%${safe}%,city.ilike.%${safe}%,neighborhood.ilike.%${safe}%`
    );
  }

  // Ordenação
  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data: properties, error } = await query;

  // Opções de filtro (pode deixar fixo ou buscar do banco depois)
  const typeOptions = [
    { value: "all", label: "Todos os tipos" },
    { value: "apto", label: "Apartamento" },
    { value: "casa", label: "Casa" },
    { value: "terreno", label: "Terreno" },
  ];

  const purposeOptions = [
    { value: "all", label: "Todas" },
    { value: "venda", label: "Venda" },
    { value: "aluguel", label: "Aluguel" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Barra de filtros (igual protótipo) */}
      <ImoveisFilters
        initial={{
          q,
          type: type || "all",
          purpose: purpose || "all",
          sort: sort || "recent",
        }}
        typeOptions={typeOptions}
        purposeOptions={purposeOptions}
      />

      {/* Resultados */}
      {error ? (
        <div className="mt-8 rounded-xl border bg-white p-6 text-sm text-red-600">
          Erro ao carregar imóveis.
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-sm text-zinc-600">
          Nenhum imóvel encontrado.
        </div>
      )}
    </main>
  );
}