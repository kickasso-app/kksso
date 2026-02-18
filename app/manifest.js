export default function manifest() {
  return {
    name: 'Arti',
    short_name: 'Arti',
    description: 'A platform to connect artists, art lovers, and collectors via studio visits and events.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffc0cb',
    icons: [
      {
        src: '/img/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/img/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/img/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
