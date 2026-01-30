'use client';

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from 'app/actions';

function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    throw new Error('VAPID public key is missing.');
  }
  
  base64String = base64String.trim();

  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  try {
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error('Error decoding VAPID key:', error);
    throw error;
  }
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if browser supports service workers and push
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }

    // Check if app is in standalone mode (installed)
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true; // iOS fallback
    setIsStandalone(isInStandalone);

    // Check notification permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      ),
    });
    setSubscription(sub);
    await subscribeUser(sub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser(subscription);
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage('');
    }
  }

  // Only show if supported, installed (standalone), and permission is not denied
  if (!isSupported || !isStandalone || permission === 'denied') {
    return null;
  }

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', margin: '10px 0' }}>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendTestNotification}>Send Test</button>
          </div>
        </>
      ) : (
        <>
          <p>Stay updated with the latest studio visits and events.</p>
          <button onClick={subscribeToPush}>Enable Notifications</button>
        </>
      )}
    </div>
  );
}
