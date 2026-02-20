import { useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdOutlineFavorite, MdLogout } from "react-icons/md";
import { clearUser } from "../ReduxTemp/userSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth0(); // get user info and auth status from Auth0
  const dispatch = useDispatch(); // get Redux dispatch function

  const handleLogout = () => {
    dispatch(clearUser());
    logout({ logoutParams: { returnTo: window.location.origin } }); // log out and return to home page
  };

  const navigate = useNavigate();

  return (
    <div
      className={`
    fixed top-0 left-0
    h-screen w-64
    bg-gray-200 dark:bg-gray-800
    shadow-lg p-5
    transform
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    transition-transform duration-300
    z-50
    md:translate-x-0
  `}
    >
      {/* Close button (mobile only) */}
      <button
        onClick={() => setIsOpen(false)}
        className="md:hidden absolute top-1 right-2 text-xl"
      >
        <RxCross2 size={20} />
      </button>
      <h2 className="font-sonsie text-[20px] leading-[100%] bg-[linear-gradient(90deg,#0d2e7c_0%,#67aefc_50%,#94979f_100%)] mb-6 bg-clip-text text-transparent">
        DevConnect
      </h2>
      <ul className="space-y-6 pt-[50px] border-t border-gray-700">
        <li>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex text-left hover:text-blue-300 cursor-pointer"
          >
            <MdSpaceDashboard size={24} />
            <span className="ml-2 text-[18px] ">Dashboard</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate("/favorites")}
            className="w-full text-left flex hover:text-blue-300 cursor-pointer"
          >
            <FaStar size={24} />
            <span className="ml-2 text-[18px]">Favorites</span>
          </button>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 border-t border-gray-700 hover:text-red-500 mt-[390px] pt-[30px] cursor-pointer"
          >
            <MdLogout size={24} />
            <span className="ml-2 text-[18px]">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
