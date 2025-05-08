'use client'

import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/efp/')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Fetch error:', err))
  }, [])

  const getGenderOption = () => {
    const counts: Record<string, number> = {}
    data.forEach(d => {
      const key = d.sex || 'Unknown'
      counts[key] = (counts[key] || 0) + 1
    })
    return {
      title: {
        text: 'Gender Distribution',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '0%',
        left: 'center'
      },
      series: [
        {
          name: 'Sex',
          type: 'pie',
          radius: '50%',
          data: Object.entries(counts).map(([name, value]) => ({ name, value })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }

  const getCategoryOption = () => {
    const counts: Record<string, number> = {}
    data.forEach(d => {
      const key = d.teacher_category || 'Unknown'
      counts[key] = (counts[key] || 0) + 1
    })
    return {
      title: {
        text: 'Teacher Category Distribution',
        left: 'center'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: Object.keys(counts)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: Object.values(counts),
          type: 'bar',
          itemStyle: {
            color: '#4F46E5'
          }
        }
      ]
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <ReactECharts option={getGenderOption()} style={{ height: 400 }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <ReactECharts option={getCategoryOption()} style={{ height: 400 }} />
        </div>
      </div>
    </div>
  )
}
