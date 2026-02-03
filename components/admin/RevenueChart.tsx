"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[350px] w-full rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            dy={10}
          />

          {/* Y Axis */}
          <YAxis hide />

          {/* Tooltip */}
          <Tooltip
            formatter={(value: any) => `$${value.toFixed(2)}`}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
          />

          {/* Gradient Fill */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area under line */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="none"
            fill="url(#revenueGradient)"
          />

          {/* Revenue Line */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4, fill: "#4f46e5" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
