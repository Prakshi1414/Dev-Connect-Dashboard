import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Navbar = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to <html> or <body>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="bg-gray-200 dark:bg-gray-900 shadow px-6 py-2 flex justify-between items-center">
      <h1 className="text-[24px] text-gray-500 font-semibold">
        GitHub Dashboard
      </h1>
      <div className="flex items-center justify-end gap-6">
        <div className="flex items-center gap-3  cursor-pointer">
          <img
            src={user?.picture}
            alt="user"
            className="w-12 h-12 border-2 border-gray-500 rounded-full"
          />
          <div className="flex flex-col">
            <span>{user?.name}</span>
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-500 bg-white p-3 cursor-pointer rounded-[5px] dark:text-gray-500 text-2xl"
          >
            {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
