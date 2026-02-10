import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsClient from 'app/events/[region]/EventsClient';
import { useRegions } from 'services/region';

// Mock services and components
jest.mock('services/region', () => ({
  useRegions: jest.fn(),
}));

jest.mock('components/EventCard', () => ({ event }) => <div data-testid="event-card">{event.title}</div>);
jest.mock('components/SelectRegion', () => () => <div data-testid="select-region">Select Region</div>);
jest.mock('react-masonry-css', () => ({ children }) => <div>{children}</div>);

describe('EventsClient (Integration)', () => {
  const mockSelectRegion = jest.fn();
  const mockEvents = [
    { id: '1', title: 'Event One' },
    { id: '2', title: 'Event Two' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useRegions.mockReturnValue({
      selectedRegion: { slugName: 'germany' },
      selectRegion: mockSelectRegion,
    });
  });

  it('renders Events heading', () => {
    render(<EventsClient events={mockEvents} region="germany" />);
    expect(screen.getByRole('heading', { level: 2, name: /Events/i })).toBeInTheDocument();
  });

  it('renders EventCards when events are provided', () => {
    render(<EventsClient events={mockEvents} region="germany" />);
    const eventCards = screen.getAllByTestId('event-card');
    expect(eventCards).toHaveLength(2);
    expect(screen.getByText('Event One')).toBeInTheDocument();
    expect(screen.getByText('Event Two')).toBeInTheDocument();
  });

  it('renders empty state and SelectRegion when no events are provided', () => {
    render(<EventsClient events={[]} region="latvia" />);
    expect(screen.getByText(/There are no events in/i)).toBeInTheDocument();
    expect(screen.getByText(/"Latvia"/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-region')).toBeInTheDocument();
  });

  it('calls selectRegion if region prop differs from selectedRegion', () => {
    render(<EventsClient events={mockEvents} region="portugal" />);
    expect(mockSelectRegion).toHaveBeenCalledWith('portugal');
  });

  it('does not call selectRegion if region prop matches selectedRegion', () => {
    render(<EventsClient events={mockEvents} region="germany" />);
    expect(mockSelectRegion).not.toHaveBeenCalled();
  });
});