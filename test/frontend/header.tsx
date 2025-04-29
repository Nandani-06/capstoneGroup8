import { render, screen } from '@testing-library/react';
import Header from '../header';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Header Component', () => {
  it('TC_04_01: renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('TC_04_02: renders logo', () => {
    render(<Header />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });
});