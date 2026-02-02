"use client";

import { useState } from "react";
import { usePWA } from "hooks/usePWA";
import Button from "components/Button";

import styles from "./index.module.scss";

export default function PushNotificationManager() {
  const {
    isSupported,
    permission,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestMessage,
  } = usePWA();

  const [message, setMessage] = useState("");

  if (!isSupported) {
    return null; // Or show a message saying not supported
  }

  // If permission is denied, show instruction

  if (permission === "denied") {
    return (
      <div className={styles.denied}>
        <h3>Notifications are blocked</h3>

        <p>
          Please enable notifications in your browser settings to receive
          updates.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.notificationsWrapper}>
      <h3>Push Notifications</h3>

      {subscription ? (
        <>
          <p>✓ You are subscribed to updates.</p>

          <div>
            <p>Test your notification:</p>

            <div>
              <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                btnStyle="filled"
                onClick={() => {
                  sendTestMessage(message);

                  setMessage("");
                }}
              >
                Send
              </Button>
            </div>
          </div>

          <div className={styles.unsubscribeWrapper}>
            <Button btnStyle="text" onClick={unsubscribeFromPush}>
              Unsubscribe
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>
            Stay updated with the latest studio visits and events directly on
            your device. <br />
            <br />
          </p>

          <Button btnStyle="filled" onClick={subscribeToPush}>
            Enable Notifications
          </Button>
        </>
      )}
    </div>
  );
}
