import React, { useEffect } from "react";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetAllChats, SetAllUsers, SetUser } from "../redux/userSlice";
import { GetAllChats } from "../apicalls/chats";

function RequireUser({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatsResponse = await GetAllChats();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetAllUsers(allUsersResponse.data));
        dispatch(SetAllChats(allChatsResponse.data));
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-400 p-2">
      {/* header */}
      <div className="flex justify-between p-5 bg-primary rounded">
        <div className="flex items-center gap-2 text-white">
          <i className="ri-wechat-line text-3xl font-bold text-gray-300"></i>
          <h1
            className="text-gray-300 text-2xl uppercase font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            QUICK CHAT
          </h1>
        </div>
        <div className="flex items-center gap-2 text-md items-center bg-gradient-to-r from-purple-500 to-pink-500 text-primary px-4 py-2 rounded-xl shadow-2xl">
          {user?.profilePic && (
            <img
              src={user.profilePic}
              alt="profile-pic"
              className="w-11 h-11 rounded-full border-2 border-white cursor-pointer shadow-2xl"
              onClick={() => navigate("/profile")}
            />
          )}
          {!user?.profilePic && (
            <i className="ri-account-pin-box-fill text-2xl"></i>
          )}
          <h1
            className="underline cursor-pointer text-xl"
            onClick={() => navigate("/profile")}
          >
            {user?.name}
          </h1>
          <i
            className="ri-logout-circle-r-line ml-5 text-xl cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          ></i>
        </div>
      </div>

      {/* content(pages) */}
      <div className="py-5">
        <h1>{children}</h1>
      </div>
    </div>
  );
}

export default RequireUser;
