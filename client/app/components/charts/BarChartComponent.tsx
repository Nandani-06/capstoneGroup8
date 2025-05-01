// components/charts/BarChartComponent.tsx
'use client';

import { TrendingUp } from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/ui/chart';

interface BarChartProps {
  title: string;
  description: string;
  data: Array<{
    month: string;
    desktop: number;
    mobile: number;
  }>;
  config: ChartConfig;
  trend: string;
  footerText: string;
}

export default function BarChartComponent({
  title,
  description,
  data,
  config,
  trend,
  footerText,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={4}
            />
            <Bar
              dataKey="mobile"
              fill="var(--color-mobile)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {footerText}
        </div>
      </CardFooter>
    </Card>
  );
}