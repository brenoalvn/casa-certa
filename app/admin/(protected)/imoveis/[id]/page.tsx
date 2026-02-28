import { supabaseSSR } from "@/lib/supabase-ssr";
import PropertyForm from "../PropertyForm";

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await supabaseSSR();

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return <p className="text-red-600">Erro: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Editar imóvel</h1>
      <p className="text-zinc-600">Atualize as informações.</p>

      <PropertyForm initial={property} />
    </div>
  );
}