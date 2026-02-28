"use client";

import { useState } from "react";
import { LeadModal } from "./lead-modal";

export function LeadCta({
  property,
}: {
  property: { id: string; title: string; slug: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="mt-3 w-full rounded-xl border px-4 py-3 font-semibold hover:bg-zinc-50"
        onClick={() => setOpen(true)}
      >
        Solicitar detalhes
      </button>

      <LeadModal
        open={open}
        onClose={() => setOpen(false)}
        property={property}
      />
    </>
  );
}