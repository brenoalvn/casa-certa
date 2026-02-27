// app/admin/(protected)/imoveis/page.tsx
import Link from "next/link";
import { supabaseSSR } from "@/lib/supabase-ssr";

type PropertyRow = {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  purpose: string;
  price: number;
  status: string;
  featured: boolean;
  created_at: string;
};

export default async function AdminImoveisPage() {
  const supabase = await supabaseSSR();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id,title,city,neighborhood,purpose,price,status,featured,created_at")
    .order("created_at", { ascending: false });

  if (error) return <p className="text-red-600">Erro: {error.message}</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Imóveis2</h1>
          <p className="text-zinc-600">Cadastre, edite e gerencie seus imóveis.</p>
        </div>

        <Link
          href="/admin/imoveis/novo"
          className="rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          + Novo imóvel
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Local</th>
              <th className="px-4 py-3 text-left">Finalidade</th>
              <th className="px-4 py-3 text-left">Preço</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(properties ?? []).map((p: PropertyRow) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-zinc-600">{p.neighborhood}, {p.city}</td>
                <td className="px-4 py-3">{p.purpose}</td>
                <td className="px-4 py-3">R$ {Number(p.price).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="rounded-md border px-3 py-1.5 hover:bg-zinc-50" href={`/admin/imoveis/${p.id}`}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {(properties ?? []).length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan={6}>
                  Nenhum imóvel cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}