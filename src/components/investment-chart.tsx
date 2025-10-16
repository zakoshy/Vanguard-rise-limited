'use client';

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { year: "2020", commercial: 40, residential: 24 },
  { year: "2021", commercial: 30, residential: 14 },
  { year: "2022", commercial: 20, residential: 98 },
  { year: "2023", commercial: 28, residential: 39 },
  { year: "2024", commercial: 19, residential: 48 },
]

const chartConfig = {
  commercial: {
    label: "Commercial",
    color: "hsl(var(--primary))",
  },
  residential: {
    label: "Residential",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function InvestmentChart() {
  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Portfolio Growth</CardTitle>
        <CardDescription>Value in millions (USD)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="commercial" fill="var(--color-commercial)" radius={4} />
            <Bar dataKey="residential" fill="var(--color-residential)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
