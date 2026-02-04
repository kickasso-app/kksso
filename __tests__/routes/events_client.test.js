import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsClient from 'app/events/[city]/EventsClient';
import { useCities } from 'services/city';

// Mock services and components
jest.mock('services/city', () => ({
  useCities: jest.fn(),
}));

jest.mock('components/EventCard', () => ({ event }) => <div data-testid="event-card">{event.title}</div>);
jest.mock('components/SelectLocation', () => () => <div data-testid="select-location">Select Location</div>);
jest.mock('react-masonry-css', () => ({ children }) => <div>{children}</div>);

describe('EventsClient (Integration)', () => {
  const mockSelectCity = jest.fn();
  const mockEvents = [
    { id: '1', title: 'Event One' },
    { id: '2', title: 'Event Two' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useCities.mockReturnValue({
      selectedCity: { slugName: 'berlin' },
      selectCity: mockSelectCity,
    });
  });

  it('renders Events heading', () => {
    render(<EventsClient events={mockEvents} city="berlin" />);
    expect(screen.getByRole('heading', { level: 2, name: /Events/i })).toBeInTheDocument();
  });

  it('renders EventCards when events are provided', () => {
    render(<EventsClient events={mockEvents} city="berlin" />);
    const eventCards = screen.getAllByTestId('event-card');
    expect(eventCards).toHaveLength(2);
    expect(screen.getByText('Event One')).toBeInTheDocument();
    expect(screen.getByText('Event Two')).toBeInTheDocument();
  });

  it('renders empty state and SelectLocation when no events are provided', () => {
    render(<EventsClient events={[]} city="london" />);
    expect(screen.getByText(/There are no events in the city/i)).toBeInTheDocument();
    expect(screen.getByText(/"London"/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-location')).toBeInTheDocument();
  });

  it('calls selectCity if city prop differs from selectedCity', () => {
    render(<EventsClient events={mockEvents} city="paris" />);
    expect(mockSelectCity).toHaveBeenCalledWith('paris');
  });

  it('does not call selectCity if city prop matches selectedCity', () => {
    render(<EventsClient events={mockEvents} city="berlin" />);
    expect(mockSelectCity).not.toHaveBeenCalled();
  });
});
