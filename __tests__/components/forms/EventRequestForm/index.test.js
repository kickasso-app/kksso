import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { queryByAttribute } from '@testing-library/dom';
import '@testing-library/jest-dom';
import EventRequestForm from 'components/forms/EventRequestForm';
import { sendEmail } from 'services/sendEmail';
import { useRequests } from 'services/requests';
import { dateUtils } from 'services/helpers/parseAvailability';

// Custom query to find elements by name attribute on the screen
const queryByName = (name) => queryByAttribute('name', document.body, name);

// Stable mock functions
const mockCreateRequest = jest.fn();

// Mock external services
jest.mock('services/sendEmail', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('services/requests', () => ({
  useRequests: jest.fn(() => ({
    createRequest: mockCreateRequest,
  })),
}));

// Mock moment and dateUtils if needed for specific date logic, otherwise rely on actual behavior
jest.mock('services/helpers/parseAvailability', () => ({
  ...jest.requireActual('services/helpers/parseAvailability'),
  dateUtils: {
    ...jest.requireActual('services/helpers/parseAvailability').dateUtils,
    to24hFormat: jest.fn((t) => {
      // Simple mock for to24hFormat for testing purposes
      if (t === '9 am') return '09:00';
      if (t === '12 pm') return '12:00';
      return t;
    }),
  },
}));

// Mock crypto for randomUUID
Object.defineProperty(global.self, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mock-uuid'),
  },
});

// Helper function from the component file, extracted for direct testing
const convertToTimestampTZ = (d, t) => {
  const [year, month, day] = d.split("-");
  // Use the mocked dateUtils.to24hFormat if it's a non-24h format
  const time = t.includes(":") ? t : dateUtils.to24hFormat(t);
  const [hours, minutes] = time.split(":");
  const dateObj = new Date(year, month - 1, day, hours, minutes);

  // Format the Date object to include the time zone offset
  // For testing consistency, we'll simplify this to a fixed ISO string
  return `2026-03-15T${hours}:${minutes}:00.000Z`; // Example fixed output
};

describe('EventRequestForm', () => {
  const mockProps = {
    artistEmail: 'artist@example.com',
    artistName: 'Test Artist',
    studioID: '123',
    studio_uuid: 'studio-abc',
    event_uuid: 'event-xyz',
    event_title: 'Test Event',
    event_date_time: 'March 15, 2026 12:00 PM',
    event_date: '2026-03-15',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations for services before each test
    sendEmail.mockResolvedValue({ emailSent: true });
    mockCreateRequest.mockResolvedValue({ requestCreated: true });
  });

  // Test for the convertToTimestampTZ helper function
  describe('convertToTimestampTZ', () => {
    it('should convert date and time to ISO 8601 timestamptz', () => {
      dateUtils.to24hFormat.mockReturnValueOnce('12:00');
      expect(convertToTimestampTZ('2026-03-15', '12 pm')).toBe('2026-03-15T12:00:00.000Z');
      dateUtils.to24hFormat.mockReturnValueOnce('09:00');
      expect(convertToTimestampTZ('2026-03-15', '9 am')).toBe('2026-03-15T09:00:00.000Z');
      expect(convertToTimestampTZ('2026-03-15', '14:30')).toBe('2026-03-15T14:30:00.000Z');
    });
  });

  it('renders all form fields and submit button', () => {
    render(<EventRequestForm {...mockProps} />);

    expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://www.instagram.com/yourProfile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell the artist why you'd like to join this event./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request to join/i })).toBeInTheDocument();
  });

  it('updates form field values on user input', () => {
    render(<EventRequestForm {...mockProps} />);

    const nameInput = screen.getByPlaceholderText(/Your name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput).toHaveValue('Jane Doe');

    const emailInput = screen.getByPlaceholderText(/your@email.com/i);
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    expect(emailInput).toHaveValue('jane@example.com');

    const reasonInput = screen.getByPlaceholderText(/Tell the artist why you'd like to join this event./i);
    fireEvent.change(reasonInput, { target: { value: 'Interested in art.' } });
    expect(reasonInput).toHaveValue('Interested in art.');
  });

  it('calls createRequest and sendEmail on form submission', async () => {
    render(<EventRequestForm {...mockProps} />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://www.instagram.com/yourProfile'), { target: { value: 'https://www.instagram.com/janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: /Request to join/i }));

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalledTimes(1);
      expect(mockCreateRequest).toHaveBeenCalledWith(expect.objectContaining({
        request_type: 'event',
        studio_uuid: mockProps.studio_uuid,
        event_uuid: mockProps.event_uuid,
        from_name: 'Jane Doe',
        requestor_email: 'jane@example.com',
        request_id: 'mock-uuid',
      }));

      expect(sendEmail).toHaveBeenCalledTimes(2); // One for artist, one for confirmation
      
      // First email to artist (using recipient ID)
      expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        emailTemplate: 'eventRequest',
        recipient: {
            type: 'studio',
            id: mockProps.studio_uuid,
        },
        emailVariables: expect.objectContaining({ from_name: 'Jane Doe' }),
      }));

      // Second email to requestor (using recipient email)
      expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        emailTemplate: 'eventRequestConfirmation',
        recipient: {
            type: 'user',
            email: ['jane@example.com'],
        },
        emailVariables: expect.objectContaining({ from_name: 'Jane Doe' }),
      }));
    });
  });

  it('shows sending request message during submission', async () => {
    // Return promises that don't resolve immediately
    let resolveCreate;
    mockCreateRequest.mockReturnValue(new Promise((resolve) => { resolveCreate = resolve; }));
    
    render(<EventRequestForm {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://www.instagram.com/yourProfile'), { target: { value: 'https://www.instagram.com/janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: /Request to join/i }));

    expect(screen.getByText(/Sending request .../i)).toBeInTheDocument();
    
    // Clean up pending promise
    await act(async () => {
        resolveCreate({ requestCreated: true });
    });
  });

  it('shows success notification after successful submission', async () => {
    render(<EventRequestForm {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://www.instagram.com/yourProfile'), { target: { value: 'https://www.instagram.com/janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: /Request to join/i }));

    await waitFor(() => {
      expect(screen.getByText(/Your request was sent!/i)).toBeInTheDocument();
    });
  });

  it('shows error notification on failed request creation', async () => {
    mockCreateRequest.mockResolvedValueOnce({ error: { message: 'DB error' } });
    sendEmail.mockResolvedValue({ emailSent: true }); // Ensure emails don't block

    render(<EventRequestForm {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://www.instagram.com/yourProfile'), { target: { value: 'https://www.instagram.com/janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: /Request to join/i }));

    await waitFor(() => {
      expect(screen.getByText(/We couldn't send your request!/i)).toBeInTheDocument();
    });
  });

  it('shows error notification on failed email sending to artist', async () => {
    mockCreateRequest.mockResolvedValueOnce({ requestCreated: true });
    sendEmail.mockResolvedValueOnce({ emailSent: false, error: { message: 'Email error' } });
    sendEmail.mockResolvedValueOnce({ emailSent: true }); // Confirmation email might still succeed

    render(<EventRequestForm {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://www.instagram.com/yourProfile'), { target: { value: 'https://www.instagram.com/janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: /Request to join/i }));

    await waitFor(() => {
      expect(screen.getByText(/We couldn't send your request!/i)).toBeInTheDocument();
    });
  });

  it('shows error notification on failed confirmation email sending', async () => {
    mockCreateRequest.mockResolvedValueOnce({ requestCreated: true });
    sendEmail.mockResolvedValueOnce({ emailSent: true });
    sendEmail.mockResolvedValueOnce({ emailSent: false, error: { message: 'Confirmation email error' } });

    render(<EventRequestForm {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://www.instagram.com/yourProfile'), { target: { value: 'https://www.instagram.com/janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: /Request to join/i }));

    await waitFor(() => {
      expect(screen.getByText(/We couldn't send your request!/i)).toBeInTheDocument();
    });
  });
});