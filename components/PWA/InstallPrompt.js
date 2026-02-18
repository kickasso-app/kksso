"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./index.module.scss";
import { Download, Settings } from "react-feather";
import { usePWA } from "hooks/usePWA";

export default function InstallPrompt() {
  const { isStandalone, subscription, isMobile, isLoading } = usePWA();
  const pathname = usePathname();

  // Logic to determine if prompt should be shown
  const showPrompt =
    !isLoading &&
    pathname === "/" &&
    isMobile &&
    (!isStandalone || !subscription);

  if (!showPrompt) return null;

  if (isStandalone) {
    return (
      <div className={styles.settingsPrompt}>
        <Link href="/install" className={styles.link} aria-label="App Settings">
          <Settings size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.prompt}>
      <Link href="/install" className={styles.link}>
        <div className={styles.contentWrapper}>
          <span className={styles.text}>Install App</span>
          <Download size={18} />
        </div>
      </Link>
    </div>
  );
}
