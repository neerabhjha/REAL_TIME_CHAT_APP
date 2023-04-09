import { axiosInstance } from ".";

export const SendMessage = async (message) => {
  try {
    const response = await axiosInstance.post(
      "/api/message/newMessage",
      message
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(
      `/api/message/getAllMessages/${chatId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
