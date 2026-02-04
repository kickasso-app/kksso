import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventCard from 'components/EventCard';
import { useRouter } from 'next/navigation';
import { useEvents } from 'services/events';
import { downloadEventImage } from 'services/images';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock services
jest.mock('services/events', () => ({
  useEvents: jest.fn(),
}));
jest.mock('services/images', () => ({
  downloadEventImage: jest.fn(),
}));

// Mock ProgressiveImage
jest.mock('react-progressive-image', () => ({ children, src }) => children(src, false));

describe('EventCard', () => {
  const mockPush = jest.fn();
  const mockGetEventImage = jest.fn();
  const mockUpdateEventImageCache = jest.fn();

  const mockEvent = {
    id: 'event-123',
    studio_uuid: 'studio-abc',
    title: 'Art Showcase',
    type: 'Exhibition',
    date: '2026-03-20',
    miniDescription: 'A wonderful showcase of local art.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    useEvents.mockReturnValue({
      getEventImage: mockGetEventImage,
      updateEventImageCache: mockUpdateEventImageCache,
    });
    downloadEventImage.mockResolvedValue('https://example.com/event-img.jpg');
  });

  it('renders event details correctly', async () => {
    mockGetEventImage.mockReturnValue('https://example.com/cached-event.jpg');

    await act(async () => {
      render(<EventCard event={mockEvent} />);
    });

    expect(screen.getByText('Art Showcase')).toBeInTheDocument();
    expect(screen.getByText(/Exhibition on 20 Mar '26/i)).toBeInTheDocument(); // Formatted date
    expect(screen.getByText('A wonderful showcase of local art.')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/cached-event.jpg');
  });

  it('navigates to event page on click', async () => {
    await act(async () => {
      render(<EventCard event={mockEvent} />);
    });

    fireEvent.click(screen.getByRole('link'));
    expect(mockPush).toHaveBeenCalledWith('/event/event-123');
  });

  it('downloads event image if not cached', async () => {
    mockGetEventImage.mockReturnValue(null);

    await act(async () => {
      render(<EventCard event={mockEvent} />);
    });

    const expectedPath = 'studio-abc/event-123/event-small.jpg';
    expect(mockGetEventImage).toHaveBeenCalledWith(expectedPath);
    expect(downloadEventImage).toHaveBeenCalledWith({ imgPath: expectedPath });
    
    await waitFor(() => {
      expect(mockUpdateEventImageCache).toHaveBeenCalledWith(expectedPath, 'https://example.com/event-img.jpg');
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/event-img.jpg');
    });
  });

  it('uses cached image if available', async () => {
    mockGetEventImage.mockReturnValue('https://example.com/cached-event.jpg');

    await act(async () => {
      render(<EventCard event={mockEvent} />);
    });

    expect(mockGetEventImage).toHaveBeenCalled();
    expect(downloadEventImage).not.toHaveBeenCalled();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/cached-event.jpg');
  });
});
