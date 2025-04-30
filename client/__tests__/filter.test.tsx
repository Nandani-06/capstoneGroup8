import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filter from '../app/components/filter';

describe('Filter Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    render(<Filter onFilterChange={mockOnFilterChange} />);
  });

  it('TC_03_01: renders all filter sections', () => {
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Schools')).toBeInTheDocument();
    expect(screen.getByText('Occupation')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('TC_03_02: handles time filter changes', () => {
    const todayButton = screen.getByText('today');
    fireEvent.click(todayButton);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('TC_03_03: handles attribute filter changes', () => {
    const schoolSelect = screen.getByText('Select Schools').closest('select');
    if (!schoolSelect) {
      throw new Error('School select element not found');
    }
    fireEvent.change(schoolSelect, { target: { value: 'school1' } });
    expect(mockOnFilterChange).toHaveBeenCalled();
  });
}); 