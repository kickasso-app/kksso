import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from 'layouts/Header';
import { useAuth } from 'services/auth';
import { useParams } from 'next/navigation';

// Mock services and sub-components
jest.mock('services/auth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));
jest.mock('layouts/Header/NavButton', () => ({ path, label, onClick }) => (
  <button onClick={onClick} data-testid="nav-button" data-path={path}>{label}</button>
));
jest.mock('layouts/Header/ProfileButton', () => () => <div data-testid="profile-button">Profile</div>);

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ session: null });
    useParams.mockReturnValue({ city: 'berlin' });
  });

  it('renders the logo', () => {
    render(<Header />);
    const logos = screen.getAllByAltText('arti');
    expect(logos[0]).toBeInTheDocument();
  });

  it('renders navigation links with city slug when present', () => {
    render(<Header />);
    // Check desktop buttons
    const studiosButtons = screen.getAllByText('Studios');
    expect(studiosButtons[0]).toBeInTheDocument();
    
    // Check if path includes city slug
    const navButtons = screen.getAllByTestId('nav-button');
    const studiosButton = navButtons.find(b => b.textContent === 'Studios');
    expect(studiosButton).toHaveAttribute('data-path', '/studios/berlin');
  });

  it('renders navigation links without city slug when absent', () => {
    useParams.mockReturnValue({});
    render(<Header />);
    const navButtons = screen.getAllByTestId('nav-button');
    const studiosButton = navButtons.find(b => b.textContent === 'Studios');
    expect(studiosButton).toHaveAttribute('data-path', '/studios');
  });

  it('shows Join button when not logged in', () => {
    render(<Header />);
    // Open mobile menu to see mobile Join
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getAllByText(/Join/i)).toHaveLength(2); // One mobile, one desktop
  });

  it('shows ProfileButton when logged in', () => {
    useAuth.mockReturnValue({ session: { user: {} } });
    render(<Header />);
    // Open mobile menu to see mobile Profile
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getAllByTestId('profile-button')).toHaveLength(2);
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    
    // Initially menu should be closed (mobile menu items not visible unless we trigger button)
    expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();

    // Open menu
    const openButton = screen.getByLabelText('Open menu');
    fireEvent.click(openButton);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    // Close menu
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
  });
});
