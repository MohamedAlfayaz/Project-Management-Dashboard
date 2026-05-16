import { useSelector } from "react-redux";

export default function Input({
  label,
  icon,
  error,
  labelClass = "",
  ...props
}) {

  // ✅ THEME
  const mode = useSelector(
    (state) => state.theme.mode
  );

  const dark = mode === "dark";

  return (
    <div className="mb-5 relative">

      {/* INPUT WRAPPER */}
      <div
        className={`flex items-center gap-2 px-3 pt-5 pb-2 
        border rounded-xl transition-all duration-200
        
        ${
          dark
            ? "bg-[#0f172a]"
            : "bg-white"
        }

        ${
          error
            ? "border-red-500"
            : dark
            ? "border-gray-700"
            : "border-gray-300"
        }

        ${
          dark
            ? "focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
            : "focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300"
        }`}
      >

        {/* ICON */}
        {icon && (
          <span
            className={`text-sm
            ${
              dark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {icon}
          </span>
        )}

        {/* INPUT */}
        <input
          {...props}
          placeholder=" "
          className={`w-full bg-transparent outline-none text-sm peer transition
          ${
            dark
              ? "text-white"
              : "text-gray-900"
          }`}
        />

      </div>

      {/* FLOATING LABEL */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none

          /* DEFAULT FLOAT */
          top-1.5 text-xs

          ${
            dark
              ? "text-gray-400"
              : "text-gray-500"
          }

          /* EMPTY */
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-sm

          ${
            dark
              ? "peer-placeholder-shown:text-gray-500"
              : "peer-placeholder-shown:text-gray-400"
          }

          /* FOCUS */
          peer-focus:top-1.5
          peer-focus:text-xs
          peer-focus:text-blue-400

          ${labelClass}`}
        >
          {label}
        </label>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}

    </div>
  );
}