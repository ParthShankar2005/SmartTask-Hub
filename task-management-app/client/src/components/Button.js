function Button({ children, type = "button", onClick, className = "", disabled = false }) {
  return (
    <button className={`btn btn-primary ${className}`.trim()} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
