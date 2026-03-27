import { useState, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function MultiSelect({
  options = [],
  selected = [],
  setSelected,
  placeholder = "Select employees...",
}) {
  const safeSelected = Array.isArray(selected) ? selected : []; // ✅ FIX

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleOption = (id) => {
    const updated = safeSelected.includes(id)
      ? safeSelected.filter((item) => item !== id)
      : [...safeSelected, id];

    setSelected(updated);
  };

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  // close outside
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
        className="bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 flex flex-wrap gap-1 cursor-pointer min-h-[44px]"
      >
        {safeSelected.length === 0 && (
          <span className="text-gray-400 text-sm">
            {placeholder}
          </span>
        )}

        {/* CHIPS */}
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {safeSelected.map((id) => {
            const emp = options.find((e) => e.id === id);
            return (
              <span
                key={id}
                className="bg-blue-600 text-xs px-2 py-1 rounded-md"
              >
                {emp?.name}
              </span>
            );
          })}
        </div>

        <div className="ml-auto flex items-center">
          <FiChevronDown />
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-full bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg z-50">

          {/* SEARCH */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* OPTIONS */}
          <div className="max-h-44 overflow-y-auto">
            {filtered.map((opt) => {
              const checked = safeSelected.includes(opt.id);

              return (
                <div
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 cursor-pointer"
                >
                  <input type="checkbox" checked={checked} readOnly />
                  <span className="text-sm">{opt.name}</span>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-gray-400 text-sm p-3">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}