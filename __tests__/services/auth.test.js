import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "services/auth";
import { supabase } from "services/supabase";
import userEvent from "@testing-library/user-event";

// Mock the supabase client
jest.mock("services/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="user-email">{auth.user?.email || "No User"}</span>
      <span data-testid="session-present">
        {auth.session ? "Session Active" : "No Session"}
      </span>
      <span data-testid="auth-loading">
        {auth.authLoading ? "Loading" : "Not Loading"}
      </span>
      <span data-testid="auth-event">{auth.event || "No Event"}</span>
      <button onClick={() => auth.signUp({ email: "test@example.com", password: "password" })}>Sign Up</button>
      <button onClick={() => auth.signIn({ email: "test@example.com", password: "password" })}>Sign In</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <button onClick={() => auth.updateUser({ data: { name: "Test User" } })}>Update User</button>
    </div>
  );
};

describe("AuthProvider and useAuth hook", () => {
  let authStateChangeCallback;
  let unsubscribeMock;

  beforeEach(() => {
    jest.clearAllMocks();

    unsubscribeMock = jest.fn();

    // Mock onAuthStateChange to immediately call the callback with initial session, then allow manual triggering
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateChangeCallback = callback;
      // Do not call callback immediately. Tests will manually trigger it.
      return { data: { subscription: { unsubscribe: unsubscribeMock } } };
    });

    // Default mock for getSession - no active session initially
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
  });

  it("should provide loading state and then no user/session if not logged in", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-loading")).toHaveTextContent("Loading");

    await act(async () => {
      // Manually trigger the initial auth state change after rendering
      authStateChangeCallback("INITIAL", { user: null, session: null });
    });

    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
    expect(screen.getByTestId("session-present")).toHaveTextContent("No Session");
    expect(screen.getByTestId("auth-event")).toHaveTextContent("INITIAL");
  });

  it("should update user and session on SIGNED_IN event", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    const mockSession = { access_token: "abc", user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    // Manually trigger SIGNED_IN event after initial load
    await act(async () => {
      authStateChangeCallback("SIGNED_IN", mockSession);
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    expect(screen.getByTestId("session-present")).toHaveTextContent("Session Active");
    expect(screen.getByTestId("auth-event")).toHaveTextContent("SIGNED_IN");
  });

  it("should clear user and session on SIGNED_OUT event", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    const mockSession = { access_token: "abc", user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    // Simulate SIGNED_IN event to establish a logged-in state
    await act(async () => {
      authStateChangeCallback("SIGNED_IN", mockSession);
    });

    // Verify user is logged in before signing out
    expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    expect(screen.getByTestId("session-present")).toHaveTextContent("Session Active");
    expect(screen.getByTestId("auth-event")).toHaveTextContent("SIGNED_IN");

    // Manually trigger SIGNED_OUT event
    await act(async () => {
      authStateChangeCallback("SIGNED_OUT", null);
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
    expect(screen.getByTestId("session-present")).toHaveTextContent("No Session");
    expect(screen.getByTestId("auth-event")).toHaveTextContent("SIGNED_OUT");
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it("should call supabase.auth.signUp when signUp is invoked", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Sign Up"));

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  it("should call supabase.auth.signInWithPassword when signIn is invoked", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Sign In"));

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  it("should call supabase.auth.signOut when signOut is invoked", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Sign Out"));

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("should call supabase.auth.updateUser when updateUser is invoked", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Update User"));

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: { name: "Test User" },
    });
  });

  it("should unsubscribe on component unmount", async () => {
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("Not Loading")
    );

    unmount();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});