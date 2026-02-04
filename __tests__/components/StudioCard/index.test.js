import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudioCard from 'components/StudioCard';
import { useRouter } from 'next/navigation';
import { useStudios } from 'services/studios';
import { downloadProfileImage } from 'services/images';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock services
jest.mock('services/studios', () => ({
  useStudios: jest.fn(),
}));
jest.mock('services/images', () => ({
  downloadProfileImage: jest.fn(),
}));

// Mock ProgressiveImage to simplify rendering
jest.mock('react-progressive-image', () => ({ children, src }) => children(src, false));

describe('StudioCard', () => {
  const mockPush = jest.fn();
  const mockGetProfileImage = jest.fn();
  const mockUpdateProfileImageCache = jest.fn();

  const mockStudio = {
    studio_id: '123',
    uuid: 'uuid-123',
    artist: 'Jane Doe',
    district: 'kreuzberg',
    styles: 'painting',
    textMini: 'A short intro about Jane.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    useStudios.mockReturnValue({
      getProfileImage: mockGetProfileImage,
      updateProfileImageCache: mockUpdateProfileImageCache,
    });
    downloadProfileImage.mockResolvedValue('https://example.com/downloaded.jpg');
  });

  it('renders studio details correctly', async () => {
    mockGetProfileImage.mockReturnValue('https://example.com/cached.jpg');

    await act(async () => {
      render(<StudioCard studio={mockStudio} />);
    });

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Kreuzberg')).toBeInTheDocument(); // Capitalized
    expect(screen.getByText('Painting')).toBeInTheDocument(); // Capitalized
    expect(screen.getByText('A short intro about Jane.')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/cached.jpg');
  });

  it('navigates to studio page on click', async () => {
    await act(async () => {
      render(<StudioCard studio={mockStudio} />);
    });

    fireEvent.click(screen.getByRole('link'));
    expect(mockPush).toHaveBeenCalledWith('/studio/123');
  });

  it('downloads profile image if not cached', async () => {
    mockGetProfileImage.mockReturnValue(null);

    await act(async () => {
      render(<StudioCard studio={mockStudio} />);
    });

    expect(mockGetProfileImage).toHaveBeenCalledWith('uuid-123');
    expect(downloadProfileImage).toHaveBeenCalledWith({ userId: 'uuid-123' });
    
    await waitFor(() => {
      expect(mockUpdateProfileImageCache).toHaveBeenCalledWith('uuid-123', 'https://example.com/downloaded.jpg');
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/downloaded.jpg');
    });
  });

  it('uses cached image if available', async () => {
    mockGetProfileImage.mockReturnValue('https://example.com/cached.jpg');

    await act(async () => {
      render(<StudioCard studio={mockStudio} />);
    });

    expect(mockGetProfileImage).toHaveBeenCalledWith('uuid-123');
    expect(downloadProfileImage).not.toHaveBeenCalled();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/cached.jpg');
  });
});
