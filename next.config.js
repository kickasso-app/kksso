const path = require("path");

const nextConfig = {
  // distDir: "build",
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
  compiler: {
    styledComponents: true,
  },
  env: {},
};

module.exports = nextConfig;
