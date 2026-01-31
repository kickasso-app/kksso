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
  const showPrompt = !isLoading && pathname === "/" && isMobile && (!isStandalone || !subscription);

  if (!showPrompt) return null;

  return (
    <div className={styles.prompt}>
      <Link
        href="/install"
        className={styles.link}
      >
        <div className={styles.contentWrapper}>
          {isStandalone ? <Settings size={18} /> : <Download size={20} />}
          <span className={styles.text}>
            {isStandalone ? "Manage App" : "Install App"}
          </span>
        </div>
        {isStandalone && (
          <p className={styles.subText}>
            Enable notifications
          </p>
        )}
      </Link>
    </div>
  );
}
