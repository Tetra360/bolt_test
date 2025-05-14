"use client";

import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { PerspectiveData } from "@/types/analysis";

interface PerspectiveChartProps {
  data: PerspectiveData;
}

export function PerspectiveChart({ data }: PerspectiveChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Transform data for chart
  const chartData = [
    { name: "Attention", value: data.attention },
    { name: "Focus", value: data.focus },
    { name: "Engagement", value: data.engagement },
    { name: "Direction", value: data.direction },
  ];

  return (
    <div className="w-full aspect-[4/3]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: isDark ? '#e1e1e6' : '#1a1a22' }}
            axisLine={{ stroke: isDark ? '#313142' : '#e1e1e6' }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: isDark ? '#e1e1e6' : '#1a1a22' }}
            axisLine={{ stroke: isDark ? '#313142' : '#e1e1e6' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1a1a22' : '#ffffff',
              borderColor: isDark ? '#313142' : '#e1e1e6',
              color: isDark ? '#e1e1e6' : '#1a1a22',
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  entry.value < 30 ? 'hsl(var(--destructive))' : 
                  entry.value < 70 ? 'hsl(var(--warning, 38 92% 50%))' : 
                  'hsl(var(--success, 120 100% 37%))'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}