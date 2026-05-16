import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

export default function MultiSelect({
  options = [],
  selected = [],
  setSelected,
  placeholder = "Select employees...",
}) {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // SAFE ARRAY
  // ==========================

  const safeSelected = Array.isArray(selected) ? selected : [];

  // ==========================
  // STATES
  // ==========================

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  // ==========================
  // TOGGLE
  // ==========================

  const toggleOption = (id) => {
    const updated = safeSelected.includes(id)
      ? safeSelected.filter((item) => item !== id)
      : [...safeSelected, id];

    setSelected(updated);
  };

  // ==========================
  // REMOVE CHIP
  // ==========================

  const removeChip = (id) => {
    const updated = safeSelected.filter((item) => item !== id);

    setSelected(updated);
  };

  // ==========================
  // FILTER
  // ==========================

  const filtered = options.filter((opt) =>
    opt.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ==========================
  // OUTSIDE CLICK
  // ==========================

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".multi-select")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative w-full multi-select">
      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className={`border rounded-2xl px-4 py-3 flex flex-wrap gap-2 cursor-pointer min-h-[56px] transition-all duration-300
        ${dark ? "bg-[#0f172a] border-gray-700" : "bg-white border-gray-300"}`}
      >
        {/* PLACEHOLDER */}
        {safeSelected.length === 0 && (
          <span
            className={`text-sm
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {placeholder}
          </span>
        )}

        {/* CHIPS */}
        <div className="flex flex-wrap gap-2 flex-1">
          {safeSelected.map((id) => {
            const emp = options.find((e) => e._id === id);

            return (
              <span
                key={id}
                className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1 rounded-xl shadow"
              >
                {emp?.name || "Unknown"}

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    removeChip(id);
                  }}
                  className="hover:text-red-200 transition"
                >
                  <FiX size={12} />
                </button>
              </span>
            );
          })}
        </div>

        {/* ICON */}
        <div className="ml-auto flex items-center">
          <FiChevronDown
            className={`transition duration-300
            ${open ? "rotate-180" : ""}
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          />
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`absolute mt-3 w-full border rounded-3xl shadow-2xl z-50 overflow-hidden transition-all duration-300
          ${
            dark ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          {/* SEARCH */}
          <div
            className={`flex items-center gap-2 px-4 py-3 border-b
            ${dark ? "border-gray-700" : "border-gray-200"}`}
          >
            <FiSearch className={dark ? "text-gray-400" : "text-gray-500"} />

            <input
              type="text"
              placeholder="Search..."
              className={`bg-transparent outline-none text-sm w-full
              ${
                dark
                  ? "text-white placeholder:text-gray-500"
                  : "text-gray-900 placeholder:text-gray-400"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* OPTIONS */}
          <div className="max-h-56 overflow-y-auto custom-scroll">
            {filtered.map((opt) => {
              const checked = safeSelected.includes(opt._id);

              return (
                <div
                  key={opt._id}
                  onClick={() => toggleOption(opt._id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200
                    ${checked ? (dark ? "bg-blue-600/20" : "bg-blue-50") : ""}
                    ${dark ? "hover:bg-[#0f172a]" : "hover:bg-gray-50"}`}
                >
                  {/* CHECKBOX */}
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center
                      ${
                        checked
                          ? "bg-blue-500 border-blue-500"
                          : dark
                            ? "border-gray-500"
                            : "border-gray-400"
                      }`}
                  >
                    {checked && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  {/* NAME */}
                  <span
                    className={`text-sm
                      ${dark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    {opt.name}
                  </span>
                </div>
              );
            })}

            {/* EMPTY */}
            {filtered.length === 0 && (
              <p
                className={`text-sm p-4 text-center
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
