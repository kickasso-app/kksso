// Helper to simulate Supabase query chains (e.g. .insert().select())
// Returns a "thenable" that resolves to the result, but also has attached methods like .select()
export const createSupabaseMock = (result, mockSelectSpy) => {
  return {
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    select: mockSelectSpy || jest.fn(),
  };
};

// Add a dummy test to satisfy Jest's requirement that every file in __tests__ has at least one test
describe('supabaseMock utility', () => {
  it('should be correctly exported', () => {
    expect(createSupabaseMock).toBeDefined();
  });
});