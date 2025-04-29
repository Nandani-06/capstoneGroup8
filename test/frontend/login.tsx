import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../../client/app/page';

describe('Login Page', () => {
  it('TC_01_01: renders login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('TC_01_02: handles form submission', async () => {
    render(<LoginPage />);
    const username = screen.getByLabelText('Username');
    const password = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button');

    fireEvent.change(username, { target: { value: 'testuser' } });
    fireEvent.change(password, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });
});
