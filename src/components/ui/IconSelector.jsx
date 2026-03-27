import { useState, useRef, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

export default function IconSelector({ selectedIcon, setSelectedIcon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const iconList = [
    { name: "FaProjectDiagram", label: "General" },
    { name: "FaCode", label: "Web" },
    { name: "FaMobileAlt", label: "Mobile" },
    { name: "FaDatabase", label: "Database" },
    { name: "FaCloud", label: "Cloud" },
    { name: "FaServer", label: "Server" },
    { name: "FaBug", label: "Testing" },
    { name: "FaCogs", label: "Automation" },
    { name: "FaRocket", label: "Deployment" },
    { name: "FaLaptopCode", label: "Development" },
    { name: "FaTools", label: "Tools" },
    { name: "FaNetworkWired", label: "Networking" },
  ];

  const selectedItem =
    iconList.find((i) => i.name === selectedIcon) || iconList[0];

  const SelectedIcon = FaIcons[selectedItem.name];

  // 🔥 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-5 relative" ref={ref}>
      {/* <label className="text-sm text-gray-300 mb-2 block">
        Project Icon
      </label> */}

      {/* SELECTED */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800 transition"
      >
        <div className="flex items-center gap-2">
          <SelectedIcon className="text-blue-400" />
          <span className="text-sm">{selectedItem.label}</span>
        </div>

        <FaChevronDown
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute w-full bg-[#1e293b] border border-gray-700 rounded-xl mt-2 p-3 z-50 shadow-xl animate-fadeIn">
          
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
                  className={`flex flex-col w-full items-center justify-center p-3 rounded-lg cursor-pointer transition text-sm
                    ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-[#0f172a] hover:bg-gray-800 text-gray-300"
                    }`}
                >
                  <Icon className="text-md mb-1" />
                  <span className="text-xs">
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