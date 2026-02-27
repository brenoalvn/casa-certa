// app/contato/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Contato | Casa Certa",
};

export default function ContatoPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Header da página */}
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Entre em contato
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Estamos prontos para ajudar você a encontrar o imóvel ideal.
        </p>
      </header>

      {/* Conteúdo */}
      <section className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Card Form */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold">Envie uma mensagem</h2>

          <form className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <input
                type="text"
                name="name"
                placeholder="Seu nome completo"
                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Telefone / WhatsApp</label>
              <input
                type="tel"
                name="phone"
                placeholder="(00) 00000-0000"
                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mensagem (opcional)</label>
              <textarea
                name="message"
                placeholder="Gostaria de mais informações sobre..."
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <button
              type="button"
              className="mt-2 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Solicitar detalhes
            </button>

            <p className="text-center text-xs text-zinc-500">
              (por enquanto este formulário é visual — depois conectamos ao Supabase/Email)
            </p>
          </form>
        </div>

        {/* Card Infos */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white">
                💬
              </div>
              <div>
                <div className="text-sm font-semibold">WhatsApp</div>
                <Link
                  href="https://wa.me/55SEUNUMEROAQUI"
                  target="_blank"
                  className="text-sm text-emerald-700 hover:underline"
                >
                  Clique para conversar
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white">
                ✉️
              </div>
              <div>
                <div className="text-sm font-semibold">E-mail</div>
                <div className="text-sm text-zinc-600">contato@casacerta.com.br</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white">
                📍
              </div>
              <div>
                <div className="text-sm font-semibold">Endereço</div>
                <div className="text-sm text-zinc-600">Centro, Campo Grande - MS</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#faf7f2] p-4 text-sm text-zinc-700">
            Atendimento em Campo Grande/MS. Se preferir, envie o link do imóvel e eu retorno
            com as informações.
          </div>
        </div>
      </section>
    </main>
  );
}