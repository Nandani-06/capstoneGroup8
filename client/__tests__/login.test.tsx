import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../app/page';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('[]'),
  })
) as jest.Mock;

describe('Login Page', () => {
  it('TC_01_01: renders template selection', async () => {
    render(<LoginPage />);
    await waitFor(() => {
      expect(screen.getByText('Select a Template')).toBeInTheDocument();
    });
    expect(screen.getByText('📁 Drag & drop your Excel/CSV file here or click to select')).toBeInTheDocument();
  });

  it('TC_01_02: handles file upload', async () => {
    render(<LoginPage />);
    const fileInput = screen.getByRole('presentation');
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    
    // Mock the dataTransfer object
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: 'text/csv',
          getAsFile: () => file,
        },
      ],
      types: ['Files'],
    };

    await waitFor(() => {
      fireEvent.drop(fileInput, {
        dataTransfer,
      });
    });
  });
}); 