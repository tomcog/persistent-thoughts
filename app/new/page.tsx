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
  const [loading, setLoading] = useState(false);

  async function handleCreate() {

    if (!title.trim()) return;

    setLoading(true);

    try {

      // Insert thought
      const { data } = await getSupabase()
        .from("thoughts")
        .insert({
          title,
          description,
        } as any)
        .select()
        .single();

      // Explicitly type the result to satisfy TypeScript
      const thought = data as { id: string } | null;

      if (!thought) {
        setLoading(false);
        return;
      }

      // Insert belief strength entry
      await getSupabase()
        .from("belief_strength_entries")
        .insert({
          thought_id: thought.id,
          value: belief,
        } as any);

      router.push("/");

    } catch (err) {

      console.error("Error creating thought:", err);
      setLoading(false);

    }
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
        className="w-full"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create"}
      </button>

    </main>
  );
}