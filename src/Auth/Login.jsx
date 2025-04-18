import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      openModal();
    }, 2000);
  };

  const openModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("error_modal");
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50 px-4 flex justify-between items-center backdrop-blur-sm bg-white/10 border border-white/10">
        <div className="flex items-center space-x-2">
          <img
            src="logo.png"
            alt="Brand Logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl font-bold text-white">
            MCES SF10 Learners
            <span className="block text-sm font-normal">
              Permanent Academic Records
            </span>
          </h1>
        </div>
        <div className="space-x-4">
          <button
            className={`btn ${
              isLoginPage
                ? "btn-disabled border-gray-400 text-gray-400 cursor-not-allowed"
                : "btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            }`}
            disabled={isLoginPage}
            onClick={() => !isLoginPage && navigate("/login")}
          >
            Login
          </button>
          <button
            className={`btn ${
              isRegisterPage
                ? "btn-disabled bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={isRegisterPage}
            onClick={() => !isRegisterPage && navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(bg.jpeg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="w-full max-w-md p-8 rounded-lg relative z-10 bg-gray-200">
          <div className="flex justify-center content-center">
            <img
              src="logo.png"
              alt="logo"
              className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4 object-contain"
            />
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="input validator w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input type="email" placeholder="example@gmail.com" required />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>

            <div className="mb-4">
              <label className="input validator w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  required
                />
              </label>
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                Show Password
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                className="select w-full sm:w-1/3 md:w-1/2 px-4 py-2 rounded-md border border-gray-300"
                required
              >
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                className="btn bg-[#048d04] border-[#048d04] text-white w-full sm:w-auto md:w-2/3 rounded-md py-2 px-4 flex items-center justify-center"
                disabled={setIsLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner mr-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-red-500">Login Failed</h3>
          <p className="py-4">Please check your email and password.</p>
        </div>
      </dialog>
    </>
  );
};

export default Login;
