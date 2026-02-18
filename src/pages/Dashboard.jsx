import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../Redux/userSlice";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth0(); // get user info and auth status from Auth0
  const dispatch = useDispatch(); // get Redux dispatch function
  const userData = useSelector((state) => state.user.userInfo); // get user info from Redux store

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setUser(user)); // store user info in Redux
    }
  }, [isAuthenticated, user, dispatch]); // run effect when auth status or user info changes

  const handleLogout = () => {
    dispatch(clearUser());
    logout({ logoutParams: { returnTo: window.location.origin } }); // log out and return to home page
  };

  if (!userData) return <div>Loading...</div>;  // show loading state while user info is being fetched

  return (
    <div className="p-10">
      <div className="flex items-center gap-4">
        <img
          src={userData.picture}
          alt="profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p>{userData.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
