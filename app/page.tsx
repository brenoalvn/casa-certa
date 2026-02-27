import Link from "next/link";
import { supabaseServer } from "@/lib/server";
import { SiteHeader } from "./components/site-header";
import { MiniCarousel } from "./components/mini-carousel";


type PropertyCard = {
  id: string;
  title: string;
  slug: string;
  price: number;
  purpose: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  featured: boolean;
  created_at: string;
  property_images?: { url: string; is_cover: boolean }[]; // 👈

};

function brl(value: number) {
  return Number(value).toLocaleString("pt-BR");
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: properties, error } = await supabaseServer
    .from("properties")
    .select(`
  id,title,slug,price,purpose,city,neighborhood,bedrooms,bathrooms,featured,created_at,status,
  property_images(url,is_cover)
`)
    .eq("status", "disponivel")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-red-600">Erro ao carregar imóveis: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="bg-[#faf7f2]">

      {/* HERO */}
      <section className="px-6 pt-24 pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-6xl leading-[1.05] tracking-tight text-zinc-900">
            Encontre o imóvel <br />
            <span className="text-emerald-700">ideal para você</span>
          </h1>

          <p className="mt-7 text-zinc-600 max-w-2xl mx-auto">
            A Casa Certa conecta você ao imóvel perfeito. Casas, apartamentos e terrenos com atendimento personalizado.
          </p>

          <div className="mt-10 flex justify-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-white font-medium hover:bg-emerald-800 transition"
              href="/imoveis"
            >
              Ver imóveis <span aria-hidden>→</span>
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-3 font-medium hover:bg-zinc-50 transition"
              href="/contato"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-zinc-900">Imóveis em destaque</h2>
            <p className="text-zinc-600 mt-2">Selecionados especialmente para você</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(properties ?? []).map((p: PropertyCard) => (
              <Link
                key={p.id}
                href={`/imoveis/${p.slug}`}
                className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden transition hover:shadow-md"
              >
                <div className="relative h-48 bg-zinc-100">
  <MiniCarousel images={p.property_images} title={p.title} />

  <div className="absolute left-4 top-4">
    <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
      {p.purpose?.toLowerCase() === "aluguel" ? "Aluguel" : "Venda"}
    </span>
  </div>

  {(p.featured ?? false) && (
    <div className="absolute right-4 top-4">
      <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
        Destaque
      </span>
    </div>
  )}
</div>

                <div className="p-5">
                  <div className="text-emerald-700 text-2xl font-semibold">
                    {p.purpose?.toLowerCase() === "aluguel"
                      ? `R$ ${brl(p.price)}/mês`
                      : `R$ ${brl(p.price)}`}
                  </div>

                  <div className="mt-2 font-semibold text-zinc-900 group-hover:underline">
                    {p.title}
                  </div>

                  <div className="text-sm text-zinc-600 mt-1">
                    {p.neighborhood ? `${p.neighborhood}, ` : ""}
                    {p.city}
                  </div>

                  <div className="mt-4 text-sm text-zinc-600 flex gap-4">
                    <span>🛏 {p.bedrooms}</span>
                    <span>🛁 {p.bathrooms}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              className="rounded-lg border border-zinc-200 bg-white px-6 py-3 font-medium hover:bg-zinc-50 transition"
              href="/imoveis"
            >
              Ver todos os imóveis
            </Link>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="px-6 py-20 border-t border-zinc-200/70 bg-[#faf7f2]">
        <div className="mx-auto max-w-6xl grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-5xl text-zinc-900">Sobre a Casa Certa</h2>
            <p className="mt-6 text-zinc-600 leading-relaxed max-w-xl">
              Somos uma imobiliária comprometida em oferecer as melhores opções de imóveis para compra e aluguel.
              Nossa missão é tornar a busca pelo imóvel ideal uma experiência simples, transparente e segura.
            </p>
            <p className="mt-4 text-zinc-600 leading-relaxed max-w-xl">
              Com anos de experiência no mercado imobiliário, nossa equipe de corretores está preparada para te ajudar
              a encontrar o imóvel perfeito para morar ou investir.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="h-56 w-72 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <div className="text-6xl">🏢</div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h3 className="font-serif text-5xl text-zinc-900">Como funciona</h3>
          <p className="mt-3 text-zinc-600">Simples e rápido em 3 passos</p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-2xl">
                🔎
              </div>
              <h4 className="mt-6 font-serif text-2xl text-zinc-900">Encontre</h4>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Navegue por nosso catálogo e filtre por tipo, localização e preço.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-2xl">
                🤝
              </div>
              <h4 className="mt-6 font-serif text-2xl text-zinc-900">Entre em contato</h4>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Solicite detalhes pelo formulário ou WhatsApp.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-2xl">
                ✅
              </div>
              <h4 className="mt-6 font-serif text-2xl text-zinc-900">Feche o negócio</h4>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Nossa equipe te acompanha até a assinatura.
              </p>
            </div>
          </div>
        </div>
      </section>    

      {/* FOOTER ESCURO (igual protótipo) */}
      <footer className="bg-zinc-900 text-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950">
                  🏠
                </span>
                <span>Casa Certa</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400 max-w-sm">
                Encontre o imóvel dos seus sonhos com a Casa Certa. Qualidade e confiança em cada negócio.
              </p>
            </div>

            <div>
              <div className="font-semibold">Navegação</div>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li><Link className="hover:text-white" href="/">Início</Link></li>
                <li><Link className="hover:text-white" href="/imoveis">Imóveis</Link></li>
                <li><Link className="hover:text-white" href="/contato">Contato</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold">Contato</div>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>WhatsApp</li>
                <li>contato@casacerta.com.br</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Casa Certa. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}