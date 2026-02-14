"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

interface Thought {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function DashboardPage() {

  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    fetchThoughts();
  }, []);

  async function fetchThoughts() {

    const { data, error } = await supabase()
      .from("thoughts")
      .select("*")
      .order("created_at", { ascending: false });

if (error) {
  console.error("Supabase error:", error.message, error.details, error.hint);
  return;
}

    setThoughts(data || []);
  }

  return (
    <main className="max-w-xl mx-auto p-8">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Persistent Thoughts
        </h1>

        <Link
          href="/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          New
        </Link>

      </div>

      <div className="space-y-3">

        {thoughts.map((thought) => (

          <Link
            key={thought.id}
            href={`/thought/${thought.id}`}
            className="block border p-4 rounded hover:bg-gray-50"
          >

            <div className="font-medium">
              {thought.title}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(thought.created_at).toLocaleDateString()}
            </div>

          </Link>

        ))}

      </div>

    </main>
  );
}