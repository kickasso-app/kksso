"use client";

import { useState, useEffect } from "react";
import Button from "components/Button";
import styles from "./index.module.scss";
import { Share2, Plus, Download, Smartphone, CheckSquare } from "react-feather";
import PushNotificationManager from "components/PWA/PushNotificationManager";
import { usePWA } from "hooks/usePWA";

export default function InstallPage() {
  const { isStandalone, isIOS } = usePWA();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [browser, setBrowser] = useState("unknown");

  useEffect(() => {
    // Detect User Agent for specific browser instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/firefox/.test(userAgent)) {
      setBrowser("firefox");
    } else if (/chrome|chromium|crios/.test(userAgent)) {
      setBrowser("chrome");
    } else if (
      /safari/.test(userAgent) &&
      !/chrome|chromium|crios/.test(userAgent)
    ) {
      setBrowser("safari-desktop");
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // console.log("Captured beforeinstallprompt event");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) {
    return (
      <div className={styles.installPage}>
        <div className={styles.container}>
          <div className={styles.installedHeader}>
            <CheckSquare size={20} />
            <span> App is installed successfully</span>
          </div>

          <div className={styles.notificationsWrapper}>
            <PushNotificationManager />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.installPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Install Arti App</h1>
        <p className={styles.description}>
          Install our app for a better experience, offline access, and easier
          access to your favorite art events and studios.
        </p>

        <div className={styles.installSection}>
          {/* Case 1: Browser supports native install prompt (Chrome/Edge/Android) */}
          {deferredPrompt && (
            <div>
              <Smartphone size={48} className={styles.browserIcon} />
              <p>Ready to install?</p>
              <br />
              <Button btnStyle="primary" onClick={handleInstallClick}>
                <Download size={18} style={{ marginRight: 8 }} />
                Install App
              </Button>
            </div>
          )}

          {/* Case 2: iOS Instructions */}
          {isIOS && (
            <div className={styles.instructions}>
              <h3>How to install on iOS:</h3>
              <ol>
                <li>
                  Tap the <strong>Share</strong> button
                  <span className={styles.icon}>
                    <Share2 size={16} />
                  </span>
                  in your browser bar.
                </li>
                <li>
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                  <span className={styles.icon}>
                    <Plus size={16} />
                  </span>
                  .
                </li>
                <li>
                  Tap <strong>Add</strong> in the top right corner.
                </li>
              </ol>
            </div>
          )}

          {/* Case 3: No prompt captured and not iOS (likely Desktop Firefox/Safari or already installed/dismissed) */}
          {!deferredPrompt && !isIOS && !isStandalone && (
            <div className={styles.instructions}>
              <h3>How to install:</h3>
              {browser === "firefox" && (
                <p>
                  On Firefox Android, tap the menu (3 dots) and select{" "}
                  <strong>"Install"</strong>.
                </p>
              )}
              {browser === "chrome" && (
                <p>
                  Tap the menu (3 dots) and select{" "}
                  <strong>"Install App"</strong> or{" "}
                  <strong>"Add to Home screen"</strong>.
                </p>
              )}
              {browser === "safari-desktop" && (
                <p>
                  On macOS Sonoma or later, you can add this website to your
                  Dock via <strong>File {">"} Add to Dock</strong>.
                </p>
              )}
              {(browser === "unknown" || browser === "safari-desktop") && (
                <p>
                  Look for an "Install" icon in your address bar or browser
                  menu.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
