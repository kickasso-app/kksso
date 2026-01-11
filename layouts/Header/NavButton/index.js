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
    <Link href={path} className={styles.navButton} onClick={handleClick}>

      <span
        className={
          router.pathname === path ? styles.labelActive : styles.label
        }
      >
        {label}
      </span>

    </Link>
  );
};

export default NavButton;
