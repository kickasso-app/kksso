import Link from "next/link";
import { withRouter } from "next/router";

import styles from "./NavButton.module.scss";

const NavButton = ({ path, label, router }) => (
  <Link href={path}>
    <div className={`${styles.navButton}`}>
      <span
        className={`${
          router.pathname === path ? styles.labelActive : styles.label
        }`}
      >
        {label}
      </span>
    </div>
  </Link>
);

export default withRouter(NavButton);
