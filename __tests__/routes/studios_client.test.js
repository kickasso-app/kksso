import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudiosClient from 'app/studios/[city]/StudiosClient';
import { useCities } from 'services/city';

// Mock services and components
jest.mock('services/city', () => ({
  useCities: jest.fn(),
}));

jest.mock('components/StudiosFilter', () => () => <div data-testid="studios-filter">Studios Filter</div>);
jest.mock('components/SelectLocation', () => () => <div data-testid="select-location">Select Location</div>);

describe('StudiosClient (Integration)', () => {
  const mockSelectCity = jest.fn();
  const mockStudios = [
    { studio_id: '1', artist: 'Artist One' },
    { studio_id: '2', artist: 'Artist Two' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useCities.mockReturnValue({
      selectedCity: { slugName: 'berlin' },
      selectCity: mockSelectCity,
    });
  });

  it('renders Studios heading', () => {
    render(<StudiosClient studios={mockStudios} city="berlin" />);
    expect(screen.getByRole('heading', { level: 2, name: /Studios/i })).toBeInTheDocument();
  });

  it('renders StudiosFilter when studios are provided', () => {
    render(<StudiosClient studios={mockStudios} city="berlin" />);
    expect(screen.getByTestId('studios-filter')).toBeInTheDocument();
    expect(screen.queryByTestId('select-location')).not.toBeInTheDocument();
  });

  it('renders empty state and SelectLocation when no studios are provided', () => {
    render(<StudiosClient studios={[]} city="london" />);
    expect(screen.getByText(/There are no studios in the city/i)).toBeInTheDocument();
    expect(screen.getByText(/"London"/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-location')).toBeInTheDocument();
    expect(screen.queryByTestId('studios-filter')).not.toBeInTheDocument();
  });

  it('calls selectCity if city prop differs from selectedCity', () => {
    render(<StudiosClient studios={mockStudios} city="paris" />);
    expect(mockSelectCity).toHaveBeenCalledWith('paris');
  });

  it('does not call selectCity if city prop matches selectedCity', () => {
    render(<StudiosClient studios={mockStudios} city="berlin" />);
    expect(mockSelectCity).not.toHaveBeenCalled();
  });
});
