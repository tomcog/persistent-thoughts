"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import BeliefChart from "@/components/BeliefChart";

interface Thought {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface BeliefStrengthEntry {
  id: string;
  thought_id: string;
  value: number;
  created_at: string;
}

export default function ThoughtDetailPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [thought, setThought] = useState<Thought | null>(null);
  const [beliefEntries, setBeliefEntries] = useState<BeliefStrengthEntry[]>([]);
  const [beliefValue, setBeliefValue] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchThought();
    fetchBeliefEntries();
  }, [id]);

  async function fetchThought() {

    const { data, error } = await supabase
      .from("thoughts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading thought:", error.message);
      return;
    }

    setThought(data);
  }

  async function fetchBeliefEntries() {

    const { data, error } = await supabase
      .from("belief_strength_entries")
      .select("*")
      .eq("thought_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading belief entries:", error.message);
      return;
    }

    if (data && data.length > 0) {
      setBeliefEntries(data);
      setBeliefValue(data[0].value);
    }

    setLoading(false);
  }

  async function updateBelief() {

    const { error } = await supabase
      .from("belief_strength_entries")
      .insert({
        thought_id: id,
        value: beliefValue
      });

    if (error) {
      console.error("Error updating belief:", error.message);
      return;
    }

    fetchBeliefEntries();
  }

  if (loading) {
    return (
      <main className="max-w-xl mx-auto p-8">
        Loading...
      </main>
    );
  }

  if (!thought) {
    return (
      <main className="max-w-xl mx-auto p-8">
        Thought not found.
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-8 space-y-6">

      <button
        onClick={() => router.push("/")}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back
      </button>

      <div>

        <h1 className="text-2xl font-semibold">
          {thought.title}
        </h1>

        {thought.description && (
          <p className="text-gray-600 mt-2">
            {thought.description}
          </p>
        )}

      </div>

          <div className="space-y-2">

      <div className="font-medium">
        Belief Trend
      </div>

      <BeliefChart entries={beliefEntries} />

    </div>

      <div className="space-y-3">

        <div className="font-medium">
          Belief Strength: {beliefValue}%
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={beliefValue}
          onChange={(e) => setBeliefValue(Number(e.target.value))}
          className="w-full"
        />

        <button
          onClick={updateBelief}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save Belief Update
        </button>

      </div>

      <div className="space-y-2">

        <div className="font-medium">
          Belief History
        </div>

        {beliefEntries.length === 0 && (
          <div className="text-sm text-gray-400">
            No entries yet
          </div>
        )}

        {beliefEntries.map(entry => (
          <div
            key={entry.id}
            className="text-sm border p-2 rounded"
          >
            {entry.value}% — {new Date(entry.created_at).toLocaleDateString()}
          </div>
        ))}

      </div>

    </main>
  );
}