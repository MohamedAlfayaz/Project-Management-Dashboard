import { useSelector } from "react-redux";

export default function DashboardCard({
  title,
  value,
  icon,
  color = "bg-blue-500",
  onClick,
  children,
}) {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-3xl border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group

      ${
        dark
          ? "bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-white/5"
          : "bg-white border-gray-200"
      }`}
    >
      {/* GLOW EFFECT */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-3xl
        ${dark ? "bg-white/5" : "bg-gray-100"}`}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex justify-between items-start">
        {/* LEFT */}
        <div>
          <p
            className={`text-xs tracking-wide
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-1
            ${dark ? "text-white" : "text-gray-900"}`}
          >
            {value}
          </h2>
        </div>

        {/* ICON */}
        <div
          className={`p-3 rounded-2xl ${color}
          bg-opacity-20 backdrop-blur-md border shadow-inner text-lg
          ${
            dark ? "border-white/10 text-white" : "border-black/5 text-gray-800"
          }`}
        >
          {icon}
        </div>
      </div>

      {/* CHILDREN */}
      {children && (
        <div
          className={`mt-4 pt-3 border-t text-sm
          ${
            dark
              ? "border-white/10 text-gray-400"
              : "border-gray-200 text-gray-500"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
