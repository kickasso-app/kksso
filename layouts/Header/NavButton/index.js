import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./NavButton.module.scss";

const NavButton = ({ path, label, onClick }) => {
  const router = useRouter();
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      router.push(path);
      onClick();
    }
  };
  return (
    <Link href={path}>
      {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
      }
      <div className={`${styles.navButton}`} onClick={handleClick}>
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
