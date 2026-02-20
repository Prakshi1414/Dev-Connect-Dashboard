import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center  bg-center relative"
      style={{ backgroundImage: "url('/assets/bg3.png')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Glass Card */}
      <div className="relative min-h-[460px] flex flex-col z-10 w-full max-w-[500px] mx-4 p-8 justify-center items-center rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-center">
        <div className="gap-[10px]">
          <h1 className="text-3xl font-bold text-white  tracking-wide">
            DevConnect
          </h1>

          <p className="text-gray-200 mb-6">
            Connect. Explore. Build Together.
          </p>
        </div>

        <button
          onClick={() => loginWithRedirect()}
          className="w-full max-w-[300px] py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition text-white font-semibold rounded-lg shadow-lg"
        >
          Login with Auth0
        </button>
      </div>
    </div>
  );
};

export default Login;
