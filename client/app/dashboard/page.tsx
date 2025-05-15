'use client'

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, CartesianGrid, BarChart, Bar, XAxis, Legend, Label } from "recharts"
import {  ChartContainer, ChartTooltip} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function DashboardPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/efp/")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Fetch error:", err))
  }, [])
  const totalGender = data.length
  const genderData = Object.entries(data.reduce((acc, d) => {
    
    const key = d.sex || "Unknown"
    acc[key] = (acc[key] || 0) + 1
    return acc
    }, {})).map(([name, value]) => ({
      name: `${name} (${((value / totalGender) * 100).toFixed(1)}%)`, // Adding percentage
      value
    }))

  // Would be good to map into a drop down for the user to filter by 
  // to reduce redundancy in code and keep more interactive
  const categoryData = Object.entries(data.reduce((acc, d) => {
    const key = d.teacher_category || "Unknown"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})).map(([name, value]) => ({ name, value }))
  .sort((a, b) => a.name.localeCompare(b.name))

  const industryData = Object.entries(data.reduce((acc, d) => {
    const key = d.industry || "Unknown"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})).map(([name, value]) => ({ name, value }))
  .sort((a, b) => a.name.localeCompare(b.name))

  const schoolCategoryData = Object.entries(data.reduce((acc, d) => {
    const key = d.school_category || "Unknown"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})).map(([name, value]) => ({ name, value }))
  .sort((a, b) => a.name.localeCompare(b.name))

  const renderChartTooltip = ({ payload }: { payload?: any[] }) => {
    if (payload && payload.length) {
      return (
        <div className={`p-2 rounded ${chartConfig.tooltip.background} ${chartConfig.tooltip.border} ${chartConfig.tooltip.shadow}`}>
          <p className="text-sm font-semibold">{payload[0].payload.name}</p>
          <p className={chartConfig.tooltip.textColor}>{payload[0].value}</p>
        </div>
      )
    }
    return null
  }


  const chartConfig = {
    color: "#2563eb", // Primary theme color
    axis: { show: true, strokeWidth: 1 },
    grid: { show: true, strokeDasharray: "3 3" },
    barStyle: { radius: 8 }, // Consistent bar styling
    pieChart: {
      innerRadius: 60,
      outerRadius: 110,
      strokeWidth: 8
    },
    tooltip: {
      background: "bg-white",
      border: "border-gray-300",
      shadow: "shadow-md",
      textColor: "text-blue-600",
    }



  }
   

  return (
    <div className="mx-auto space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-5">
        
        {/* Gender Donut Chart */}    
        <Card className="flex flex-col">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="w-full h-[400px] flex items-center justify-center">
              <PieChart>
                <ChartTooltip cursor={false} content={renderChartTooltip} />
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" 
                  cy="50%" 
                  innerRadius={chartConfig.pieChart.innerRadius}
                  outerRadius={chartConfig.pieChart.outerRadius} 
                  strokeWidth={chartConfig.pieChart.strokeWidth}
               >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#2563eb", "#3b82f6", "#1e40af"][index % 3]} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-semibold"
                            >
                              {totalGender.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Members
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>


          </CardContent>
        </Card>

        
        {/* Industry Donut Chart */}       
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="w-full h-[400px] flex items-center justify-center">
              <PieChart>
                <ChartTooltip cursor={false} content={renderChartTooltip} />
                <Pie
                  data={industryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" 
                  cy="50%" 
                  innerRadius={chartConfig.pieChart.innerRadius}
                  outerRadius={chartConfig.pieChart.outerRadius} 
                  strokeWidth={chartConfig.pieChart.strokeWidth}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#2563eb", "#3b82f6", "#1e40af"][index % 3]} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-semibold"
                            >
                              Industries
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* School Category Chart */}       
        <Card>
          <CardHeader>
            <CardTitle>School Types</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="w-full h-[400px] flex items-center justify-center">
              <PieChart>
                <ChartTooltip cursor={false} content={renderChartTooltip} />
                <Pie
                  data={schoolCategoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" 
                  cy="50%" 
                  outerRadius={chartConfig.pieChart.outerRadius} 
                  strokeWidth={chartConfig.pieChart.strokeWidth}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#2563eb", "#3b82f6", "#1e40af"][index % 3]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>



      
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {/* Teacher Category Bar Chart */}       
        <Card>
          <CardHeader>
            <CardTitle>Teacher Subject Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[400px]">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray={chartConfig.grid.strokeDasharray} vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} fontWeight={600} />
                <ChartTooltip
                  cursor={false}
                  content={renderChartTooltip} 
                />
                <Bar dataKey="value" fill={chartConfig.color} radius={chartConfig.barStyle.radius} />
              </BarChart>
            </ChartContainer>

          </CardContent>
        </Card>

      </div>
    </div>

    
  )
}
