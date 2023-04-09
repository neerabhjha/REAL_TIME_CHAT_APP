import { axiosInstance } from ".";

export const GetAllChats = async () => {
  try {
    const response = await axiosInstance.get("/api/chat/getAllChats");
    // console.log("res from getAllChat", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewChat = async (members) => {
  try {
    const response = await axiosInstance.post("/api/chat/createNewChat", {
      members,
    });
    console.log("res from createNewChat", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ClearChatMessages = async (chatId) => {
  try {
    const response = await axiosInstance.post("/api/chat/clearUnreadMessages", {
      chat: chatId,
    });
    // console.log("res from clearChatMessages", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
