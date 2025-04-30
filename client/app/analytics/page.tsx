'use client';

import Header from '../components/header';
import DonutChart from '../components/charts/DonutChart';
import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import Filter from '../components/filter';
import { chartData, chartConfig } from '../components/charts/ChartData';

export default function ProcessPage() {
  const handleFilterChange = (filters: { time: string; attribute: string }) => {
    console.log('Filters applied:', filters);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-sm text-gray-900 bg-white">
      {/* Header */}
      <Header />

      {/* Filter Component */}
      <div className="mt-4 mb-6 ml-8">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      </div>
    </div>
  );
}