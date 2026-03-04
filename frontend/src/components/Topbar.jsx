import { BellIcon } from "lucide-react";

/**
 * Topbar component that provides the main header for the application layout.
 * Displays the application title and a notifications bell icon.
 */
const Topbar = () => {
  return (
    <header
      className="h-14 bg-white shadow flex justify-between px-6 items-center fixed left-64 top-0 right-0 z-30"
      style={{ height: 56 }}
    >
      <span className="font-semibold">Enterprise Management System</span>
      <button className=" text-gray-600 cursor-pointer border border-gray-400 rounded-sm p-1">
        <BellIcon />
      </button>
    </header>
  );
};

export default Topbar;
