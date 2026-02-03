import { Nunito_Sans } from "next/font/google";
import { Providers } from "components/Providers";
import StyledComponentsRegistry from "lib/registry";
import Header from "layouts/Header";
import InstallPrompt from "components/PWA/InstallPrompt";

import "../styles/base.scss";
import "../styles/colors.scss";
import "../styles/emailStyles.scss";
import "react-flexbox-grid/dist/react-flexbox-grid.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata = {
  title: "Arti",
  description:
    "A platform to connect artists, art lovers, and collectors via studio visits and events.",
  openGraph: {
    siteName: "Arti",
    title: "Arti",
    type: "website",
    description:
      "A platform to connect artists, art lovers, and collectors via studio visits and events.",
    url: "https://arti.my/",
    images: [
      {
        url: "https://arti.my/img/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Arti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/img/favicon.ico" },
      { url: "/img/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffc0cb",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable}`}
    >
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <div className="layout">
              <InstallPrompt />
              <Header />
              <div className="content">{children}</div>
            </div>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
