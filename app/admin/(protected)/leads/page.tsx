import { supabaseSSR } from "@/lib/supabase-ssr";

type LeadRow = {
  id: string;
  property_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
};

export default async function AdminLeadsPage() {
  const supabase = await supabaseSSR();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id,property_id,name,email,phone,message,status,created_at")
    .order("created_at", { ascending: false });

  if (error) return <p className="text-red-600">Erro: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="text-zinc-600">Visualize os contatos recebidos pelos imóveis.</p>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">E-mail</th>
              <th className="px-4 py-3 text-left">Telefone</th>
              <th className="px-4 py-3 text-left">Imóvel</th>
              <th className="px-4 py-3 text-left">Mensagem</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l: LeadRow) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3">{l.name}</td>
                <td className="px-4 py-3">{l.email}</td>
                <td className="px-4 py-3">{l.phone}</td>
                <td className="px-4 py-3">{l.property_id}</td>
                <td className="px-4 py-3">{l.message}</td>
                <td className="px-4 py-3">{l.status}</td>
                <td className="px-4 py-3">
                  {new Date(l.created_at).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}

            {(leads ?? []).length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan={7}>
                  Nenhum lead registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
