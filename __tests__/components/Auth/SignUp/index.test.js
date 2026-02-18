import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "components/Auth/SignUp";
import { useAuth } from "services/auth";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("services/auth", () => ({
  useAuth: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignUp Component", () => {
  const mockSignUp = jest.fn();
  const mockPush = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      signUp: mockSignUp.mockResolvedValue({ data: { user: null, session: null }, error: null }),
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

  it("renders the sign-up form", () => {
    render(<SignUp />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
  });

  it("calls signUp with correct credentials on form submission", async () => {
    render(<SignUp />);

    await user.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await user.type(screen.getByLabelText(/password/i), "newpassword123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "newuser@example.com",
      password: "newpassword123",
    });
  });

  it("redirects to welcome page on successful sign-up", async () => {
    const newUser = { id: "new-user-id", email: "newuser@example.com" };
    mockSignUp.mockResolvedValueOnce({ error: null });
    useAuth.mockReturnValueOnce({
      signUp: mockSignUp,
      user: newUser,
    });

    render(<SignUp />);

    await user.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await user.type(screen.getByLabelText(/password/i), "newpassword123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/welcome?email=${newUser.email}`
      );
    });
  });

  it("shows an alert on sign-up error", async () => {
    const errorMessage = "User already exists";
    mockSignUp.mockResolvedValueOnce({ error: { message: errorMessage } });

    render(<SignUp />);

    await user.type(screen.getByLabelText(/email/i), "existing@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});