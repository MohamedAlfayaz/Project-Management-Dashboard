import { useEffect } from "react";

import { useSelector } from "react-redux";

import {
  FiX,
} from "react-icons/fi";

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
}) {

  // ==========================
  // THEME
  // ==========================

  const mode = useSelector(
    (state) => state.theme.mode
  );

  const dark = mode === "dark";

  // ==========================
  // ESC CLOSE
  // ==========================

  useEffect(() => {

    const handleEsc = (e) => {

      if (e.key === "Escape") {

        onClose();
      }
    };

    if (isOpen) {

      document.addEventListener(
        "keydown",
        handleEsc
      );

      // PREVENT SCROLL
      document.body.style.overflow =
        "hidden";
    }

    return () => {

      document.removeEventListener(
        "keydown",
        handleEsc
      );

      document.body.style.overflow =
        "auto";
    };

  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
      ${
        isOpen
          ? "visible"
          : "invisible"
      }`}
    >

      {/* OVERLAY */}
      <div
        className={`absolute inset-0 transition-opacity duration-300
        ${
          dark
            ? "bg-black/60"
            : "bg-black/40"
        }
        ${
          isOpen
            ? "opacity-100"
            : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className={`relative w-[95%] sm:w-[500px] max-h-[90vh] rounded-3xl shadow-2xl border transform transition-all duration-300 overflow-hidden
        ${
          dark
            ? "bg-[#1e293b] text-white border-gray-800"
            : "bg-white text-gray-900 border-gray-200"
        }
        ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >

        {/* HEADER */}
        <div
          className={`flex justify-between items-center px-5 py-4 border-b
          ${
            dark
              ? "border-gray-700"
              : "border-gray-200"
          }`}
        >

          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
            ${
              dark
                ? "text-gray-400 hover:text-white hover:bg-[#0f172a]"
                : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}
          >

            <FiX size={20} />

          </button>

        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto max-h-[75vh] custom-scroll">

          {children}

        </div>

      </div>

    </div>
  );
}