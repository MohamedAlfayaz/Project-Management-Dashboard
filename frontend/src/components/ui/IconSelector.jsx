import { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";

import * as FaIcons from "react-icons/fa";

import { FaChevronDown } from "react-icons/fa";

export default function IconSelector({ selectedIcon, setSelectedIcon }) {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // STATES
  // ==========================

  const [open, setOpen] = useState(false);

  const ref = useRef();

  // ==========================
  // ICON LIST
  // ==========================

  const iconList = [
    {
      name: "FaProjectDiagram",
      label: "General",
    },
    {
      name: "FaCode",
      label: "Web",
    },
    {
      name: "FaMobileAlt",
      label: "Mobile",
    },
    {
      name: "FaDatabase",
      label: "Database",
    },
    {
      name: "FaCloud",
      label: "Cloud",
    },
    {
      name: "FaServer",
      label: "Server",
    },
    {
      name: "FaBug",
      label: "Testing",
    },
    {
      name: "FaCogs",
      label: "Automation",
    },
    {
      name: "FaRocket",
      label: "Deployment",
    },
    {
      name: "FaLaptopCode",
      label: "Development",
    },
    {
      name: "FaTools",
      label: "Tools",
    },
    {
      name: "FaNetworkWired",
      label: "Networking",
    },
  ];

  // ==========================
  // SELECTED
  // ==========================

  const selectedItem =
    iconList.find((i) => i.name === selectedIcon) || iconList[0];

  const SelectedIcon = FaIcons[selectedItem.name];

  // ==========================
  // OUTSIDE CLICK
  // ==========================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-5 relative" ref={ref}>
      {/* SELECTED */}
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between border rounded-2xl px-4 py-3 cursor-pointer transition-all duration-300
        ${
          dark
            ? "bg-[#0f172a] border-gray-700 hover:bg-[#111827]"
            : "bg-white border-gray-300 hover:bg-gray-50"
        }`}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <SelectedIcon className="text-blue-400 text-lg" />
          </div>

          <div>
            <p
              className={`text-xs
              ${dark ? "text-gray-500" : "text-gray-400"}`}
            >
              Project Icon
            </p>

            <span
              className={`text-sm font-medium
              ${dark ? "text-gray-200" : "text-gray-800"}`}
            >
              {selectedItem.label}
            </span>
          </div>
        </div>

        {/* ARROW */}
        <FaChevronDown
          className={`transition duration-300
          ${open ? "rotate-180" : ""}
          ${dark ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`absolute w-full border rounded-3xl mt-3 p-4 z-50 shadow-2xl animate-fadeIn transition-all duration-300
          ${
            dark ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="grid grid-cols-3 gap-3">
            {iconList.map((item) => {
              const Icon = FaIcons[item.name];

              const isSelected = selectedIcon === item.name;

              return (
                <div
                  key={item.name}
                  onClick={() => {
                    setSelectedIcon(item.name);

                    setOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer transition-all duration-300 text-sm border
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                      : dark
                        ? "bg-[#0f172a] border-gray-700 hover:bg-[#111827] text-gray-300"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon className="text-lg mb-2" />

                  <span className="text-xs font-medium text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
