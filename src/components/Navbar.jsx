import { useSelector } from "react-redux";
import { useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { TfiMenuAlt } from "react-icons/tfi";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../ReduxTemp/themeSlice";
import toast from "react-hot-toast";

const Navbar = ({ isOpen, setIsOpen }) => {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  // Apply dark mode class to the document root when darkMode state changes

  useEffect(() => {
    console.log(
      "User info from Redux:",
      user?.picture,
      user?.name,
      user?.email,
    );
  }, [user]);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 shadow px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-5 relative z-10">
      {/* Menu Button (mobile only + hide when sidebar open) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-2xl mr-[15px] "
        >
          <TfiMenuAlt size={23} />
        </button>
      )}

      <h1 className="text-[24px] whitespace-nowrap text-gray-500 font-semibold">
        GitHub Dashboard
      </h1>
      <div className="flex sm:flex-row sm:items-center sm:justify-end gap-5 sm:gap-6 w-full">
        {/* User info */}
        {user ? (
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={user.picture}
              alt="user"
              className="w-12 h-12 border-2 border-gray-500 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100">
                {user.name}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Loading...</span>
        )}

        {/* Dark Mode Toggle */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <button
            onClick={() => {
              dispatch(toggleTheme());
              if (mode === "dark") {
                toast.success("Light Mode Enabled ☀️");
              } else {
                toast.success("Dark Mode Enabled 🌙");
              }
            }}
            className="text-black bg-gray-100 p-2 sm:p-3 cursor-pointer rounded-[5px] dark:bg-gray-400 dark:text-black text-xl sm:text-2xl"
          >
            {mode === "dark" ? (
              <MdLightMode size={24} />
            ) : (
              <MdDarkMode size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
