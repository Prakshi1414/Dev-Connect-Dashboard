import { useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdOutlineFavorite, MdLogout } from "react-icons/md";
import { clearUser } from "../ReduxTemp/userSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa6";

const Sidebar = () => {
  const { logout } = useAuth0(); // get user info and auth status from Auth0
  const dispatch = useDispatch(); // get Redux dispatch function

  const handleLogout = () => {
    dispatch(clearUser());
    logout({ logoutParams: { returnTo: window.location.origin } }); // log out and return to home page
  };

  const navigate = useNavigate();

  return (
    <div className="w-54 max-h-screen bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-gray-200 hover:bg-slate-200 shadow-lg p-5 pt-[25px] hidden md:block">
      <h2 className="font-sonsie text-[20px] leading-[100%] bg-[linear-gradient(90deg,#0d2e7c_0%,#f1f6f0_50%,#94979f_100%)] mb-6 bg-clip-text text-transparent">
        DevConnect
      </h2>

      <ul className="space-y-6 pt-[50px] border-t border-gray-700">
        <li>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex text-left hover:text-blue-300 cursor-pointer"
          >
            <MdSpaceDashboard size={24} />
            <span className="ml-2 text-[18px]">Dashboard</span>
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
