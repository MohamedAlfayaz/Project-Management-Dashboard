export default function DashboardCard({
  title,
  value,
  icon,
  color = "bg-blue-500",
  onClick,
  children,
}) {
  return (
    <div
      onClick={onClick}
      className="
        relative
        bg-gradient-to-br from-[#1e293b] to-[#0f172a]
        p-5 rounded-2xl
        border border-white/5
        shadow-md
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        cursor-pointer
        overflow-hidden
        group
      "
    >
      {/* 🔥 Glow Effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition rounded-2xl" />

      <div className="relative z-10 flex justify-between items-start">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-gray-400 text-xs tracking-wide">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-1 text-white">
            {value}
          </h2>
        </div>

        {/* ICON */}
        <div
          className={`
            p-3 rounded-xl
            ${color}
            bg-opacity-20
            backdrop-blur-md
            border border-white/10
            text-white text-lg
            shadow-inner
          `}
        >
          {icon}
        </div>
      </div>

      {/* 🔥 Divider Line */}
      {children && (
        <div className="mt-4 pt-3 border-t border-white/10 text-sm text-gray-400">
          {children}
        </div>
      )}
    </div>
  );
}