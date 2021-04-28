import styles from "./index.module.scss";

const Button = ({ type = "", btnStyle, children }) => {
  return (
    <button type={type} className={styles[btnStyle]}>
      {children}
    </button>
  );
};

export default Button;
