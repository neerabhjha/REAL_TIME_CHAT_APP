import { axiosInstance } from ".";

export const LoginUser = async (user) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", user);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const RegisterUser = async (user) => {
  try {
    const response = await axiosInstance.post("/api/auth/signup", user);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/user/getCurrentUser");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/user/getAllUsers");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const UpdateProfilePicture = async (image) => {
  try {
    const response = await axiosInstance.post(
      "/api/user/updateProfilePicture",
      { image }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
