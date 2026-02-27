import PropertyForm from "../PropertyForm";

export default function NovoImovelPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Novo imóvel</h1>
      <p className="text-zinc-600">Preencha os dados para cadastrar.</p>

      <PropertyForm />
    </div>
  );
}