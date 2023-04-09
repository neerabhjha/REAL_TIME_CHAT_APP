import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { UpdateProfilePicture } from "../../apicalls/users";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import { SetUser } from "../../redux/userSlice";

function Profile() {
  const { user } = useSelector((state) => state.userReducer);
  const [image = "", setImage] = useState(user?.profilePic || "");
  const dispatch = useDispatch();

  const onFileSelect = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  const updateProfilePic = async () => {
    try {
      dispatch(ShowLoader());
      const response = await UpdateProfilePicture(image);
      dispatch(HideLoader());
      if (response.success) {
        toast.success("Profile picture updated successfully");
        dispatch(SetUser(response.data));
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };
  return (
    user && (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-xl font-bold text-gray-500 bg-gray-200 flex gap-2 flex-col p-5 w-max border border-gray-500 shadow-2xl rounded-xl">
          <h1>{user?.name}</h1>
          <h1>{user?.email}</h1>
          <h1>
            Created At:{" "}
            {moment(user?.createdAt).format("MMMM D, YYYY, HH:mm:ss")}
          </h1>
          {image && (
            <img
              src={image}
              alt="profile-pic"
              className="w-32 h-32 rounded-full"
            />
          )}

          <div className="flex gap-2">
            <label htmlFor="file-input" className="cursor-pointer">
              <i className="ri-file-add-fill text-3xl text-gray-800"></i> Update
              Profile Pic
            </label>
            <input
              type="file"
              onChange={onFileSelect}
              className="file-input"
              id="file-input"
            />
            <button className="btn-primary" onClick={updateProfilePic}>
              Update
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default Profile;
