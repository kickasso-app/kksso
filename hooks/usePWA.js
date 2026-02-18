"use client";

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

export function usePWA() {
  const [isSupported, setIsSupported] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check support
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    // Check standalone
    const mq = window.matchMedia("(display-mode: standalone)");
    const checkStandalone = () => {
      setIsStandalone(mq.matches || window.navigator.standalone === true);
    };
    
    checkStandalone();
    mq.addEventListener("change", checkStandalone);

    // Check iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && !/FxiOS/i.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check Mobile
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|operamini/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // Check permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    return () => {
      mq.removeEventListener("change", checkStandalone);
    };
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }

  async function subscribeToPush() {
    try {
      if (Notification.permission === 'default') {
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);
        if (permissionResult !== 'granted') {
          console.warn("Permission not granted for Notification");
          return;
        }
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ),
      });
      setSubscription(sub);
      setPermission(Notification.permission);
      await subscribeUser(sub);
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  }

  async function unsubscribeFromPush() {
    try {
      await subscription?.unsubscribe();
      setSubscription(null);
      await unsubscribeUser(subscription);
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
    }
  }

  async function sendTestMessage(message) {
    if (subscription) {
      await sendNotification(message);
    }
  }

  return {
    isSupported,
    isStandalone,
    isIOS,
    isMobile,
    isLoading,
    permission,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestMessage
  };
}
