import Link from "next/link";
import { withRouter } from "next/router";

import styles from "./NavButton.module.scss";

const NavButton = (props) => (
  <Link href={props.path}>
    <div className={`${styles.navButton}`}>
      <span
        className={`${
          props.router.pathname === props.path
            ? styles.labelActive
            : styles.label
        }`}
      >
        {props.label}
      </span>
    </div>
  </Link>
);

export default withRouter(NavButton);
