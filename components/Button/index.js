import styles from "./index.module.scss";

const Button = ({
  type = "button",
  btnStyle,
  onClick,
  children,
  padding,
  disabled,
  as: Component = "button",
}) => {
  return (
    <Component
      type={Component === "button" ? type : undefined}
      disabled={disabled}
      className={styles[btnStyle]}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Button;
