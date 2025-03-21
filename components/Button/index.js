import styles from "./index.module.scss";

const Button = ({
  type = "button",
  btnStyle,
  onClick,
  children,
  padding,
  disabled,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={styles[btnStyle]}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
