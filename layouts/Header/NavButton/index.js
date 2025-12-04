import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./NavButton.module.scss";

const NavButton = ({ path, label }) => {
  const router = useRouter();
  return (
    <Link href={path}>
      <div className={`${styles.navButton}`}>
        <span
          className={
            router.pathname === path ? styles.labelActive : styles.label
          }
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default NavButton;
