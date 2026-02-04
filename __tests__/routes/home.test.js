import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from 'app/page';

// Mock the components used in LandingClient
jest.mock('components/Button', () => ({ children, btnStyle, ...props }) => <button {...props}>{children}</button>);
jest.mock('layouts/Footer', () => () => <footer>Footer</footer>);
jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock('next/image', () => ({ priority, ...props }) => <img {...props} />);

// Mock Grommet components that might be problematic or slow
jest.mock('grommet', () => {
  const actual = jest.requireActual('grommet');
  return {
    ...actual,
    ResponsiveContext: {
      Consumer: ({ children }) => children('large'),
      Provider: ({ children }) => children,
    },
  };
});

describe('Home Page (Landing)', () => {
  it('renders the main heading', () => {
    render(<Page />);
    expect(screen.getByText(/Discover Your Local Art Scene/i)).toBeInTheDocument();
  });

  it('renders the "Explore Studios" and "Join Events" links', () => {
    render(<Page />);
    expect(screen.getByRole('link', { name: /Explore Studios/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Join Events/i })).toBeInTheDocument();
  });

  it('renders the "How it works" section', () => {
    render(<Page />);
    expect(screen.getByText(/How it works in detail/i)).toBeInTheDocument();
    expect(screen.getByText(/For Artists and Curators/i)).toBeInTheDocument();
    expect(screen.getByText(/For Art Lovers and Collectors/i)).toBeInTheDocument();
  });

  it('renders the Footer', () => {
    render(<Page />);
    expect(screen.getByText(/Footer/i)).toBeInTheDocument();
  });
});
