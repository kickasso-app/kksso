// Helper to simulate Supabase query chains (e.g. .insert().select())
// Returns a "thenable" that resolves to the result, but also has attached methods like .select()
export const createSupabaseMock = (result, mockSelectSpy) => {
  return {
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    select: mockSelectSpy || jest.fn(),
  };
};
