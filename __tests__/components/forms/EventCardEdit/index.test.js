import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventCardEdit from 'components/forms/EventCardEdit';
import useEventImage from 'hooks/useEventImage';

// Mock useEventImage hook
jest.mock('hooks/useEventImage', () => jest.fn());

describe('EventCardEdit', () => {
  const mockOnEdit = jest.fn();
  const mockOnView = jest.fn();
  const mockOnPreview = jest.fn();

  const mockEvent = {
    id: '1',
    title: 'Test Event',
    type: 'Studio Visit',
    date: 'March 20, 2026',
    isPublished: true,
    isMainEvent: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useEventImage.mockReturnValue(['https://example.com/small.jpg', jest.fn()]);
  });

  it('renders event details correctly', () => {
    render(
      <EventCardEdit
        event={mockEvent}
        onEdit={mockOnEdit}
        onView={mockOnView}
        onPreview={mockOnPreview}
      />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Studio Visit')).toBeInTheDocument();
    expect(screen.getByText('On March 20, 2026')).toBeInTheDocument();
    expect(screen.getByText(/Published/i)).toBeInTheDocument();
    expect(screen.getByText(/(main)/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/small.jpg');
  });

  it('renders fallback UI for missing data', () => {
    useEventImage.mockReturnValue([null, jest.fn()]);
    const emptyEvent = { id: '2', isPublished: false };
    
    render(
      <EventCardEdit
        event={emptyEvent}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText('On unspecified date')).toBeInTheDocument();
    expect(screen.getByText('Not Published')).toBeInTheDocument();
    expect(screen.getByText('No Img')).toBeInTheDocument();
  });

  it('calls onView when published event view button is clicked', () => {
    render(
      <EventCardEdit
        event={mockEvent}
        onEdit={mockOnEdit}
        onView={mockOnView}
      />
    );

    // Get the first button (View/Eye icon)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockOnView).toHaveBeenCalledWith('1');
    expect(mockOnPreview).not.toHaveBeenCalled();
  });

  it('calls onPreview when unpublished event view button is clicked', () => {
    const unpublishedEvent = { ...mockEvent, isPublished: false };
    render(
      <EventCardEdit
        event={unpublishedEvent}
        onEdit={mockOnEdit}
        onPreview={mockOnPreview}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockOnPreview).toHaveBeenCalledWith('1');
    expect(mockOnView).not.toHaveBeenCalled();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <EventCardEdit
        event={mockEvent}
        onEdit={mockOnEdit}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Second button is Edit

    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
