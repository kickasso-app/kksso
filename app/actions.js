'use server';

import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:hello@arti.my',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// In a real app, you would store these in Supabase or another database.
// For now, we'll use a simple in-memory store (which resets on server restart).
let subscriptions = [];

export async function subscribeUser(sub) {
  // Convert sub to string if it's an object (depends on how it's passed)
  const subscription = typeof sub === 'string' ? JSON.parse(sub) : sub;
  
  // Store the subscription
  subscriptions.push(subscription);
  
  console.log('User subscribed:', subscription);
  return { success: true };
}

export async function unsubscribeUser(sub) {
  const subscription = typeof sub === 'string' ? JSON.parse(sub) : sub;
  subscriptions = subscriptions.filter(s => s.endpoint !== subscription.endpoint);
  
  console.log('User unsubscribed');
  return { success: true };
}

export async function sendNotification(message) {
  if (subscriptions.length === 0) {
    return { success: false, error: 'No subscriptions available' };
  }

  const payload = JSON.stringify({
    title: 'Arti Notification',
    body: message,
    icon: '/img/web-app-manifest-192x192.png',
  });

  const results = await Promise.allSettled(
    subscriptions.map(sub => 
      webpush.sendNotification(sub, payload)
    )
  );

  console.log('Notification results:', results);
  return { success: true };
}
