const path = require("path");

const nextConfig = {
  distDir: "build",
  outDir: "export",
  // exportPathMap: async function (
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId }
  // ) {
  //   return {
  //     "/": { page: "/" },
  //     "/about": { page: "/about" },
  //     "/join": { page: "/join" },
  //     "/studios": { page: "/studios" },
  //     "/studio/1": { page: "/studio/1" },

  //     // '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
  //   };
  // },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `
        $color-primary: #4b4b4b;
        $color-primary-black: #222;
        $color-secondary: #FFC0CB;
        $color-quad: #C0FFF4;
        $color--bg-white: #fff;
        $color-gray: rgba(0, 0, 0, 0.1);
    `,
  },
  env: {
    // FIREBASE_API_KEY: "AIzaSc8MqCGj34t5mjU",
    // FIREBASE_AUTH_DOMAIN: "kksso-101.firebaseapp.com",
  },
};

module.exports = nextConfig;
