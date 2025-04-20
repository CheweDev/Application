import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import supabase from "../Supabase";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setFullName] = useState("");
  const [grade_level, setGradeLevel] = useState("");
  const [email, setEmail] = useState("");
  const [section, setSection] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("TEACHER");

  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("Users").insert([
        { name, grade_level, email, password, role, section, status: "Pending" },
      ]);

      if (error) {
        console.error("Error inserting data:", error);
        openModal();
      } else {
        console.log("Data inserted successfully:", data);
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      openModal();
    } finally {
      setIsLoading(false);
    }
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
                : "border-green-600 hover:bg-green-600 bg-green-700 text-white"
            }`}
            disabled={isLoginPage}
            onClick={() => !isLoginPage && navigate("/")}
          >
            Login
          </button>
          <button
            className={`btn ${
              isRegisterPage
                ? "btn-disabled bg-gray-400 border-gray-400 text-gray-400 cursor-not-allowed"
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
        <div className="w-full max-w-md p-8 rounded-lg relative z-10 bg-gray-200 mt-5">
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
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="mb-3">
            <label className="input validator w-full">
              <select
                value={grade_level}
                onChange={(e) => setGradeLevel(e.target.value)}
                required
                className="w-full rounded"
              >
                <option value="">Select Grade Level</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>
            </label>
          </div>


            <div className="mb-3">
              <label className="input validator w-full">
                <input
                  type="text"
                  placeholder="Section - Ex. Narra"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="mb-3">
              <label className="input validator w-full">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>

            <div className="mb-3">
              <label className="input validator w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="input validator w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                className="btn bg-[#048d04] border-[#048d04] text-white w-full sm:w-auto md:w-2/3 rounded-md py-2 px-4 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner mr-2"></span>
                    Registering...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Register
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
          <h3 className="font-bold text-lg text-red-500">
            Registration Failed
          </h3>
          <p className="py-4">Please check your inputs and try again.</p>
        </div>
      </dialog>
    </>
  );
};

export default Register;