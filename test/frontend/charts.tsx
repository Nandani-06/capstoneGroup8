
import { render, screen } from '@testing-library/react';
import DonutChart from '../DonutChart';
import LineChartComponent from '../LineChartComponent';
import BarChartComponent from '../BarChartComponent';

const mockData = [
  { month: 'January', desktop: 100, mobile: 50 }
];

const mockConfig = {
  desktop: { label: 'Desktop', color: '#000' },
  mobile: { label: 'Mobile', color: '#fff' }
};

describe('Chart Components', () => {
  it('TC_02_01: renders DonutChart correctly', () => {
    render(
      <DonutChart
        title="Test Donut"
        description="Test Description"
        data={mockData}
        config={mockConfig}
        dataKey="desktop"
        trend="+15%"
        footerText="Last 7 days"
      />
    );
    expect(screen.getByText('Test Donut')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('TC_02_02: renders LineChart correctly', () => {
    render(
      <LineChartComponent
        title="Test Line"
        description="Test Description"
        data={mockData}
        config={mockConfig}
        trend="+15%"
        footerText="Last 7 days"
      />
    );
    expect(screen.getByText('Test Line')).toBeInTheDocument();
  });

  it('TC_02_03: renders BarChart correctly', () => {
    render(
      <BarChartComponent
        title="Test Bar"
        description="Test Description"
        data={mockData}
        config={mockConfig}
        trend="+15%"
        footerText="Last 7 days"
      />
    );
    expect(screen.getByText('Test Bar')).toBeInTheDocument();
  });
});
