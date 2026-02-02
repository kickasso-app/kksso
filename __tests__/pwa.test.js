import {
  render,
  screen,
  fireEvent,
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import InstallPrompt from "components/PWA/InstallPrompt";
import InstallPage from "app/install/page";
import PushNotificationManager from "components/PWA/PushNotificationManager";
import { usePWA } from "hooks/usePWA";
import * as actions from "app/actions";

// Mock Next.js hooks
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock Server Actions
jest.mock("app/actions", () => ({
  subscribeUser: jest.fn(),
  unsubscribeUser: jest.fn(),
  sendNotification: jest.fn(),
}));

// Mock Icons to avoid rendering issues
jest.mock("react-feather", () => ({
  Download: () => <div data-testid="icon-download" />,
  Settings: () => <div data-testid="icon-settings" />,
  Share2: () => <div data-testid="icon-share" />,
  Plus: () => <div data-testid="icon-plus" />,
  Smartphone: () => <div data-testid="icon-smartphone" />,
  CheckSquare: () => <div data-testid="icon-check-square" />,
}));

describe("PWA Functionality", () => {
  const originalUserAgent = navigator.userAgent;
  const originalMatchMedia = window.matchMedia;
  const originalNavigator = window.navigator;

  // Setup mocks
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/");

    // Default matchMedia mock (false)
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock Service Worker
    Object.defineProperty(navigator, "serviceWorker", {
      value: {
        register: jest.fn().mockResolvedValue({
          pushManager: {
            getSubscription: jest.fn().mockResolvedValue(null),
            subscribe: jest.fn().mockResolvedValue({
              endpoint: "test-endpoint",
              unsubscribe: jest.fn().mockResolvedValue(true),
            }),
          },
        }),
        ready: Promise.resolve({
          pushManager: {
            subscribe: jest.fn().mockResolvedValue({
              endpoint: "test-endpoint",
              unsubscribe: jest.fn().mockResolvedValue(true),
            }),
          },
        }),
      },
      writable: true,
    });

    // Mock PushManager
    window.PushManager = {};

    // Mock Notification
    window.Notification = {
      permission: "default",
      requestPermission: jest.fn().mockResolvedValue("granted"),
    };

    // Default User Agent (Mobile)
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      writable: true,
    });
    window.matchMedia = originalMatchMedia;
  });

  describe("usePWA Hook", () => {
    it("should detect mobile device", async () => {
      const { result } = renderHook(() => usePWA());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isMobile).toBe(true);
    });

    it("should detect standalone mode", async () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(display-mode: standalone)",
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => usePWA());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isStandalone).toBe(true);
    });

    it("should detect iOS", async () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        writable: true,
      });

      const { result } = renderHook(() => usePWA());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isIOS).toBe(true);
    });
  });

  describe("InstallPrompt Component", () => {
    it("should show 'Install App' on mobile homepage when not installed", async () => {
      // Mock Mobile
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36",
        writable: true,
      });

      await act(async () => {
        render(<InstallPrompt />);
      });

      // Wait for async checks in hook
      await waitFor(() => {
        expect(screen.getByText("Install App")).toBeInTheDocument();
      });
      expect(screen.queryByLabelText("App Settings")).not.toBeInTheDocument();
    });

    it("should NOT show on non-mobile (Desktop)", async () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        writable: true,
      });

      await act(async () => {
        render(<InstallPrompt />);
      });

      expect(screen.queryByText("Install App")).not.toBeInTheDocument();
    });

    it("should show Settings icon if installed but not subscribed", async () => {
      // Mock Installed (Standalone)
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(display-mode: standalone)",
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      await act(async () => {
        render(<InstallPrompt />);
      });

      await waitFor(() => {
        expect(screen.getByLabelText("App Settings")).toBeInTheDocument();
      });
      expect(screen.queryByText("Install App")).not.toBeInTheDocument();
    });
  });

  describe("InstallPage", () => {
    it("should render install instructions for Android/Chrome by default (or when prompt captured)", async () => {
      // Mock non-standalone
      window.matchMedia = jest.fn().mockReturnValue({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      await act(async () => {
        render(<InstallPage />);
      });

      expect(screen.getByText("Install Arti App")).toBeInTheDocument();
      expect(
        screen.getByText(/Install our app for a better experience/),
      ).toBeInTheDocument();

      // Simulate beforeinstallprompt event
      const event = new Event("beforeinstallprompt");
      event.prompt = jest.fn();
      event.userChoice = Promise.resolve({ outcome: "accepted" });

      act(() => {
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(screen.getByText("Install App")).toBeInTheDocument(); // The button inside the page
      });
    });

    it("should render iOS specific instructions", async () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        writable: true,
      });

      await act(async () => {
        render(<InstallPage />);
      });

      expect(screen.getByText("How to install on iOS:")).toBeInTheDocument();
      expect(screen.getByText("Share")).toBeInTheDocument();
      expect(screen.getByText('"Add to Home Screen"')).toBeInTheDocument();
    });

    it("should render 'App is installed' when in standalone mode", async () => {
      window.matchMedia = jest.fn().mockReturnValue({
        matches: true,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      await act(async () => {
        render(<InstallPage />);
      });

      expect(
        screen.getByText("App is installed successfully"),
      ).toBeInTheDocument();
      expect(screen.getByText("Push Notifications")).toBeInTheDocument(); // From PushNotificationManager
    });
  });

  describe("PushNotificationManager", () => {
    it("should show 'Enable Notifications' when supported and not subscribed", async () => {
      await act(async () => {
        render(<PushNotificationManager />);
      });

      await waitFor(() => {
        expect(screen.getByText("Enable Notifications")).toBeInTheDocument();
      });
    });

    it("should show 'Notifications are blocked' when permission denied", async () => {
      window.Notification.permission = "denied";

      await act(async () => {
        render(<PushNotificationManager />);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Notifications are blocked"),
        ).toBeInTheDocument();
      });
    });
  });
});
