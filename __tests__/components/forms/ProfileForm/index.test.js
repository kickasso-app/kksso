import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { queryByAttribute } from '@testing-library/dom';
import '@testing-library/jest-dom';
import ProfileForm from 'components/forms/ProfileForm';
import { useAuth } from 'services/auth';
import { useAccount } from 'services/account';

// Custom query to find elements by name attribute on the screen
const queryByName = (name) => queryByAttribute('name', document.body, name);

// Mock the services
jest.mock('services/auth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('services/account', () => ({
  useAccount: jest.fn(),
}));

describe('ProfileForm', () => {
  const mockProfile = {
    artist: 'John Doe',
    location: ['Berlin', 'Germany'],
    textMini: 'A short intro about John Doe.',
    textLong: 'Detailed description of John Doe\'s art.',
    styles: 'painting, sculpture',
    languages: 'English, German',
    website: 'https://johndoe.com',
    instagram: 'https://instagram.com/johndoe',
  };

  const mockGoToTab = jest.fn();
  const mockUpdateAccount = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    useAuth.mockReturnValue({
      user: { id: 'test-user-id' },
    });
    useAccount.mockReturnValue({
      updateAccount: mockUpdateAccount,
      loading: false,
      isUpdateSuccess: false,
      isUpdateError: false,
    });
    mockUpdateAccount.mockClear();
    mockGoToTab.mockClear();
  });

  it('renders all form fields with initial profile data', () => {
    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    expect(screen.getByDisplayValue(mockProfile.artist)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.location.join(', '))).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.textMini)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.styles)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.textLong)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.languages)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.website)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.instagram)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('calls goToTab when the Settings link is clicked', () => {
    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    fireEvent.click(screen.getByText(/Settings/i));

    expect(mockGoToTab).toHaveBeenCalledTimes(1);
    expect(mockGoToTab).toHaveBeenCalledWith(3);
  });

  it('updates form field values on user input', () => {
    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    // Using queryByName for more direct targeting of input by its name attribute
    const artistInput = queryByName('artist');
    fireEvent.change(artistInput, { target: { value: 'Jane Doe' } });
    expect(artistInput).toHaveValue('Jane Doe');

    const locationInput = queryByName('location');
    fireEvent.change(locationInput, { target: { value: 'Latvia, UK' } });
    expect(locationInput).toHaveValue('Latvia, UK');
  });

  it('submits the form with updated values and calls updateAccount', async () => {
    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    const artistInput = queryByName('artist');
    fireEvent.change(artistInput, { target: { value: 'Jane Doe' } });

    const locationInput = queryByName('location');
    fireEvent.change(locationInput, { target: { value: 'Latvia, UK' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateAccount).toHaveBeenCalledTimes(1);
      expect(mockUpdateAccount).toHaveBeenCalledWith(
        {
          ...mockProfile,
          artist: 'Jane Doe',
          location: ['Latvia', 'UK'], // Ensure location is split correctly
        },
        { id: 'test-user-id' }
      );
    });
  });

  it('shows success notification on successful update', async () => {
    useAccount.mockReturnValue({
      updateAccount: mockUpdateAccount,
      loading: false,
      isUpdateSuccess: true,
      isUpdateError: false,
    });

    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    expect(screen.getByText(/Your profile was updated./i)).toBeInTheDocument();
  });

  it('shows error notification on failed update', async () => {
    useAccount.mockReturnValue({
      updateAccount: mockUpdateAccount,
      loading: false,
      isUpdateSuccess: false,
      isUpdateError: true,
    });

    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    expect(screen.getByText(/Your profile was not updated!/i)).toBeInTheDocument();
    expect(screen.getByText(/We couldn\'t complete your request this time. Please try again./i)).toBeInTheDocument();
  });

  it('disables the save button when loading', () => {
    useAccount.mockReturnValue({
      updateAccount: mockUpdateAccount,
      loading: true,
      isUpdateSuccess: false,
      isUpdateError: false,
    });

    render(<ProfileForm profile={mockProfile} goToTab={mockGoToTab} />);

    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeDisabled();
  });
});
