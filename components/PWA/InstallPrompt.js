"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./index.module.scss";
import { Share2, Plus } from "react-feather";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (pathname !== "/" || isStandalone || !isIOS) {
    return null;
  }

  return (
    <div className={styles.prompt}>
      <h3>Install App</h3>
      <p>
        To install on your phone, tap the Share button
        <span role="img" aria-label="share icon">
          {"  "}
          <Share2 size={14} strokeWidth={2} />
          {"  "}
        </span>
        <br />
        and then "Add to Home Screen"
        <span role="img" aria-label="plus icon">
          {" "}
          <Plus size={14} strokeWidth={2} />{" "}
        </span>
        .
      </p>
    </div>
  );
}
