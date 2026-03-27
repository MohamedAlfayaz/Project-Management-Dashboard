import { FiLoader } from "react-icons/fi";

export default function Button({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  disabled,
  ...props
}) {
  const base =
    "flex items-center justify-center gap-2 font-medium rounded-lg transition active:scale-95";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800",
    ghost: "text-gray-300 hover:bg-gray-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        <FiLoader className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}

      {children && <span className={base}>{children}</span>}
    </button>
  );
}