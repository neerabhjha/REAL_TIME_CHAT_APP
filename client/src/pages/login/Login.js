import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import '../../stylesheets/style.css'

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      dispatch(ShowLoader());
      const response = await LoginUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-img">
      <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96 rounded-xl">
        <div className="flex gap-2">
          <i className="ri-wechat-line text-3xl font-bold text-gray-700"></i>
          <h1 className="text-2xl  uppercase font-semibold text-gray-700">
            QuickChat Login
          </h1>
        </div>
        <hr />
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
          <button
            className={
              user?.email && user?.password ? "btn-primary" : "disabled-btn"
            }
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

        <Link to="/signup" className="underline">
          Don't have an account? Signup
        </Link>
      </div>
    </div>
  );
}

export default Login;
