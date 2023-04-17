import styles from "./index.module.scss";

const Button = ({ type = "button", btnStyle, onClick, children, padding }) => {
  return (
    <button type={type} className={styles[btnStyle]} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
