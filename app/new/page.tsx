"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewThoughtPage() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [belief, setBelief] = useState(50);

  async function handleCreate() {

    const { data: thought } = await getSupabase
      .from("thoughts")
      .insert({ title, description })
      .select()
      .single();

    if (!thought) return;

    await getSupabase
      .from("belief_strength_entries")
      .insert({
        thought_id: thought.id,
        value: belief,
      });

    router.push("/");
  }

  return (
    <main className="max-w-xl mx-auto p-8 space-y-4">

      <h1 className="text-xl font-semibold">
        New Thought
      </h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Thought title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        Belief strength: {belief}%
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={belief}
        onChange={(e) => setBelief(Number(e.target.value))}
      />

      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>

    </main>
  );
}