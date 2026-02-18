import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationLayer from 'components/NotificationLayer';
import { Grommet, ResponsiveContext } from 'grommet';

// Mock Grommet's Layer if needed, but let's try to use the real one first.
// However, Layer renders outside the container, so we need to check document.body or use screen queries.

const renderWithContext = (ui, size = 'large') => {
  return render(
    <Grommet>
      <ResponsiveContext.Provider value={size}>
        {ui}
      </ResponsiveContext.Provider>
    </Grommet>
  );
};

describe('NotificationLayer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders notification with title and message', () => {
    const onClose = jest.fn();
    renderWithContext(
      <NotificationLayer
        title="Test Title"
        message="Test Message"
        onClose={onClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    renderWithContext(
      <NotificationLayer
        title="Test Title"
        onClose={onClose}
      />
    );

    // Grommet may render a clone for measuring, so we might find multiple buttons.
    // We target the one in the active layer (usually the last one).
    const buttons = screen.getAllByRole('button', { name: /dismiss/i });
    const closeButton = buttons[buttons.length - 1];
    
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('auto-closes after timeout', () => {
    const onClose = jest.fn();
    renderWithContext(
      <NotificationLayer
        title="Test Title"
        onClose={onClose}
        autoClose={3000}
      />
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('clears timer on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = renderWithContext(
      <NotificationLayer
        title="Test Title"
        onClose={onClose}
        autoClose={3000}
      />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders correctly on mobile', () => {
    renderWithContext(
      <NotificationLayer
        title="Mobile Title"
      />,
      'small'
    );
    
    // Check if it renders
    expect(screen.getByText('Mobile Title')).toBeInTheDocument();
    
    // We can't easily check styles or Layer props without mocking Layer or checking computed styles.
    // But we can check if it exists.
  });
});
