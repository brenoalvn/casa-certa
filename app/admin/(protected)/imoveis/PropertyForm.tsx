"use client";

import { supabase } from "@/lib/client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

type PropertyFormData = {
  id?: string;
  title: string;
  slug: string;
  type: string;
  purpose: string;
  price: number;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  built_area: number | null;
  total_area: number | null;
  description: string;
  status: string;
  featured: boolean;
};

type ImgLocal = {
  id: string;
  file: File;
  preview: string;
};

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Erro desconhecido";
  }
};

export default function PropertyForm({
  initial,
}: {
  initial?: Partial<PropertyFormData>;
}) {
  const router = useRouter();

  const [form, setForm] = useState<PropertyFormData>({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    type: initial?.type ?? "casa",
    purpose: initial?.purpose ?? "venda",
    price: Number(initial?.price ?? 0),
    city: initial?.city ?? "Campo Grande",
    neighborhood: initial?.neighborhood ?? "",
    bedrooms: Number(initial?.bedrooms ?? 0),
    bathrooms: Number(initial?.bathrooms ?? 0),
    parking_spots: Number(initial?.parking_spots ?? 0),
    built_area: initial?.built_area ?? null,
    total_area: initial?.total_area ?? null,
    description: initial?.description ?? "",
    status: initial?.status ?? "disponivel",
    featured: Boolean(initial?.featured ?? false),
  });

  const [msg, setMsg] = useState<string>("");
  const isEdit = useMemo(() => Boolean(form.id), [form.id]);

  // ✅ múltiplas imagens + capa
  const [images, setImages] = useState<ImgLocal[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const mapped: ImgLocal[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const next = [...prev, ...mapped];
      // se não tinha nada antes, garante capa 0
      if (prev.length === 0) setCoverIndex(0);
      return next;
    });

    // permite escolher o mesmo arquivo novamente depois
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx >= 0) URL.revokeObjectURL(prev[idx].preview);

      const next = prev.filter((x) => x.id !== id);

      setCoverIndex((ci) => {
        if (next.length === 0) return 0;
        if (idx === ci) return 0; // removeu a capa -> volta pra primeira
        if (idx < ci) return Math.max(0, ci - 1);
        return Math.min(ci, next.length - 1);
      });

      return next;
    });
  };

  const clearAllImages = () => {
    images.forEach((x) => URL.revokeObjectURL(x.preview));
    setImages([]);
    setCoverIndex(0);
  };

  const autoSlugFromTitle = () => {
    const s = slugify(form.title);
    setForm((prev) => ({ ...prev, slug: s }));
  };

  const onChange = <K extends keyof PropertyFormData>(
    key: K,
    value: PropertyFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImagesAndSave = async (propertyId: string) => {
    if (images.length === 0) return;

    // 1) desmarca capas antigas
    const { error: updErr } = await supabase
      .from("property_images")
      .update({ is_cover: false })
      .eq("property_id", propertyId);

    if (updErr) throw new Error(updErr.message);

    // 2) upload e prepara rows
    const rows: { property_id: string; url: string; is_cover: boolean }[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i].file;

      const maxMb = 6;
      if (file.size > maxMb * 1024 * 1024) {
        throw new Error(`Imagem ${file.name} é muito grande. Máximo ${maxMb}MB.`);
      }

      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${propertyId}/${Date.now()}-${i}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("property-images")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (upErr) throw new Error(upErr.message);

      const { data: pub } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      rows.push({
        property_id: propertyId,
        url: pub.publicUrl,
        is_cover: i === coverIndex,
      });
    }

    // 3) insere no banco
    const { error: insErr } = await supabase.from("property_images").insert(rows);
    if (insErr) throw new Error(insErr.message);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Salvando...");

    try {
      // 1) garante slug
      const baseSlug = form.slug ? slugify(form.slug) : slugify(form.title);
      let finalSlug = baseSlug || `imovel-${Date.now()}`;

      // 2) evitar slug duplicado ao criar
      if (!isEdit) {
        const { data: existing } = await supabase
          .from("properties")
          .select("id")
          .eq("slug", finalSlug)
          .maybeSingle();

        if (existing?.id) finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;
      }

      // 3) payload
      const payload = {
        ...(isEdit ? { id: form.id } : {}),
        title: form.title,
        slug: finalSlug,
        type: form.type,
        purpose: form.purpose,
        price: form.price,
        city: form.city,
        neighborhood: form.neighborhood,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        parking_spots: form.parking_spots,
        built_area: form.built_area,
        total_area: form.total_area,
        description: form.description,
        status: form.status,
        featured: form.featured,
      };

      // 4) salva e PEGA o ID
      const { data: saved, error: saveErr } = await supabase
        .from("properties")
        .upsert(payload)
        .select("id")
        .single();

      if (saveErr) throw new Error(saveErr.message);

      const propertyId = saved.id as string;

      // 5) upload de imagens (se houver)
      if (images.length > 0) {
        setMsg("Enviando imagens...");
        await uploadImagesAndSave(propertyId);
      }

      setMsg("Salvo ✅");
      router.push("/admin/imoveis");
      router.refresh();
    } catch (err: unknown) {
      setMsg(`Erro: ${getErrorMessage(err)}`);
    }
  };

  return (
    <form onSubmit={handleSave} className="mt-6 space-y-6">
      {/* IMAGENS */}
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Imagens do imóvel</label>

        <div className="mt-2 rounded-xl border bg-white p-4">
          <input type="file" accept="image/*" multiple onChange={handleImagesChange} />

          {images.length === 0 ? (
            <div className="mt-3 rounded-xl border bg-zinc-50 p-6 text-sm text-zinc-600">
              Nenhuma imagem selecionada.
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {images.map((img, idx) => (
                  <div key={img.id} className="overflow-hidden rounded-xl border">
                    <div className="relative">
                      <img
                        src={img.preview}
                        alt="Preview"
                        className="h-40 w-full object-cover"
                      />

                      {idx === coverIndex && (
                        <span className="absolute left-2 top-2 rounded-full bg-emerald-700 px-2 py-1 text-xs font-semibold text-white">
                          Capa
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2">
                      <button
                        type="button"
                        className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50"
                        onClick={() => setCoverIndex(idx)}
                      >
                        Definir capa
                      </button>

                      <button
                        type="button"
                        className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50"
                        onClick={() => removeImage(img.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={clearAllImages}
                className="mt-3 rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
              >
                Remover todas
              </button>
            </>
          )}
        </div>
      </div>

      {/* CAMPOS */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Título</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            onBlur={autoSlugFromTitle}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Slug</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            placeholder="ex: casa-moderna-jardim-dos-estados"
          />
          <button
            type="button"
            onClick={autoSlugFromTitle}
            className="mt-2 text-sm underline text-zinc-600 hover:text-zinc-800"
          >
            Gerar slug automaticamente
          </button>
        </div>

        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            <option value="casa">Casa</option>
            <option value="apto">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Finalidade</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.purpose}
            onChange={(e) => onChange("purpose", e.target.value)}
          >
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Preço</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            type="number"
            value={form.price}
            onChange={(e) => onChange("price", Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="alugado">Alugado</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Cidade</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Bairro</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            value={form.neighborhood}
            onChange={(e) => onChange("neighborhood", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Quartos</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            type="number"
            value={form.bedrooms}
            onChange={(e) => onChange("bedrooms", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Banheiros</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            type="number"
            value={form.bathrooms}
            onChange={(e) => onChange("bathrooms", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Vagas</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            type="number"
            value={form.parking_spots}
            onChange={(e) => onChange("parking_spots", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Área construída (m²)</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            type="number"
            value={form.built_area ?? ""}
            onChange={(e) =>
              onChange("built_area", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Área total (m²)</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white"
            type="number"
            value={form.total_area ?? ""}
            onChange={(e) =>
              onChange("total_area", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2 bg-white min-h-[120px]"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => onChange("featured", e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Marcar como destaque
          </label>
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex items-center gap-3">
        <button className="rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">
          Salvar
        </button>

        <button
          type="button"
          className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          onClick={() => router.push("/admin/imoveis")}
        >
          Cancelar
        </button>

        {msg && <span className="text-sm text-zinc-600">{msg}</span>}
      </div>
    </form>
  );
}