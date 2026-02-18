import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastNotification from 'components/ToastNotification';
import NotificationLayer from 'components/NotificationLayer';

// Mock NotificationLayer
jest.mock('components/NotificationLayer', () => {
  return jest.fn(({ title, message, status, icon, onClose, autoClose }) => (
    <div data-testid="notification-layer">
      <span>{title}</span>
      <span>{message}</span>
      <span>{status}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ));
});

describe('ToastNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders success notification for Update Profile', () => {
    render(<ToastNotification success type="Update Profile" />);

    const props = NotificationLayer.mock.calls[0][0];
    expect(props).toEqual(expect.objectContaining({
      status: 'normal',
      title: 'Your profile was updated successfully.',
      autoClose: 3000,
    }));
  });

  it('renders warning notification for Update Profile', () => {
    render(<ToastNotification warning type="Update Profile" />);

    const props = NotificationLayer.mock.calls[0][0];
    expect(props).toEqual(expect.objectContaining({
      status: 'warning',
      title: 'Your profile was not updated',
      message: 'We couldn\'t complete your request this time. Please try again.',
      autoClose: false,
    }));
  });

  it('renders success notification for Photo Upload', () => {
    render(<ToastNotification success type="Photo Upload" />);

    const props = NotificationLayer.mock.calls[0][0];
    expect(props).toEqual(expect.objectContaining({
      status: 'normal',
      title: 'Your photo was uploaded successfully.',
      autoClose: 3000,
    }));
  });

  it('renders warning notification for Photo Upload with custom message', () => {
    const customMessage = 'File too large';
    render(<ToastNotification warning type="Photo Upload" message={customMessage} />);

    const props = NotificationLayer.mock.calls[0][0];
    expect(props).toEqual(expect.objectContaining({
      status: 'warning',
      title: 'Your photo was not uploaded',
      message: customMessage,
      autoClose: false,
    }));
  });

  it('renders success notification for Update Event', () => {
    render(<ToastNotification success type="Update Event" />);

    const props = NotificationLayer.mock.calls[0][0];
    expect(props).toEqual(expect.objectContaining({
      status: 'normal',
      title: 'Your event was updated successfully.',
      autoClose: 3000,
    }));
  });

  it('renders nothing if neither success nor warning is true', () => {
    const { container } = render(<ToastNotification type="Update Profile" />);
    expect(container).toBeEmptyDOMElement();
    expect(NotificationLayer).not.toHaveBeenCalled();
  });

  it('passes onClose prop', () => {
    const mockOnClose = jest.fn();
    render(<ToastNotification success type="Update Profile" onClose={mockOnClose} />);

    const props = NotificationLayer.mock.calls[0][0];
    expect(props).toEqual(expect.objectContaining({
      onClose: mockOnClose,
      autoClose: 3000,
    }));
  });
});
