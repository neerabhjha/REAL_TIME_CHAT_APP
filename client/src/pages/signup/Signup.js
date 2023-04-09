import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";

function Signup() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      dispatch(ShowLoader());
      const response = await RegisterUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
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
    <div className="h-screen bg-img flex items-center justify-center">
      <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96 rounded-xl">
        <div className="flex gap-2">
          <i className="ri-wechat-line text-3xl font-bold text-gray-700"></i>
          <h1 className="text-2xl  uppercase font-semibold text-gray-700">
            QuickChat Signup
          </h1>
        </div>
        <hr />

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Enter your name"
          />
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
            onClick={handleSignup}
          >
            Signup
          </button>
        </form>

        <Link to="/login" className="underline">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
