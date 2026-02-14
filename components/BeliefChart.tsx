"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { BeliefStrengthEntry } from "@/lib/types";
import { format } from "date-fns";

interface Props {
  entries: BeliefStrengthEntry[];
}

export default function BeliefChart({ entries }: Props) {

  const data = entries.map((entry) => ({
    date: format(new Date(entry.created_at), "MMM d"),
    value: entry.value,
  }));

  if (data.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No belief data yet
      </div>
    );
  }

  return (
    <div className="w-full h-64">

      <ResponsiveContainer>

        <LineChart data={data}>

          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            fontSize={12}
          />

          <YAxis
            domain={[0, 100]}
            fontSize={12}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#000"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}