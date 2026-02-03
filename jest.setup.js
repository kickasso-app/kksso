import "@testing-library/jest-dom";
import React from 'react';

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      update: jest.fn().mockResolvedValue({ data: [], error: null }),
      delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  })),
}));

jest.mock('services/city', () => ({
  useCities: jest.fn(() => ({
    cities: [],
    fetchCities: jest.fn(),
    selectedCity: { slugName: 'berlin' },
    selectCity: jest.fn(),
    loading: false,
    error: null,
  })),
  CityProvider: ({ children }) => <>{children}</>,
}));
