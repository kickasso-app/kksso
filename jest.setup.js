import "@testing-library/jest-dom";
import React from 'react';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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

jest.mock('services/region', () => ({
  useRegions: jest.fn(() => ({
    regions: [],
    fetchRegions: jest.fn(),
    selectedRegion: { slugName: 'germany' },
    selectRegion: jest.fn(),
    loading: false,
    error: null,
  })),
  RegionProvider: ({ children }) => <>{children}</>,
}));
