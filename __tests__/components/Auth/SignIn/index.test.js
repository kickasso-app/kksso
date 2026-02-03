import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "components/Auth/SignIn";
import { useAuth } from "services/auth";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("services/auth", () => ({
  useAuth: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignIn Component", () => {
  const mockSignIn = jest.fn();
  const mockPush = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      signIn: mockSignIn.mockResolvedValue({ data: { user: null, session: null }, error: null }),
      user: null, // Default to no user logged in
    });
    useRouter.mockReturnValue({
      push: mockPush,
    });
    // Mock window.alert to prevent it from blocking tests
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the sign-in form", () => {
    render(<SignIn />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument(); // Button text is "Sign Up" due to original code
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("calls signIn with correct credentials on form submission", async () => {
    render(<SignIn />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("redirects to home page on successful sign-in", async () => {
    // Simulate successful sign-in by resolving mockSignIn without an error
    mockSignIn.mockResolvedValueOnce({ error: null });
    useAuth.mockReturnValueOnce({
      signIn: mockSignIn,
      user: { id: "user-id", email: "test@example.com" }, // Simulate user being set after sign-in
    });

    render(<SignIn />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows an alert on sign-in error", async () => {
    const errorMessage = "Invalid credentials";
    mockSignIn.mockResolvedValueOnce({ error: { message: errorMessage } });

    render(<SignIn />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});