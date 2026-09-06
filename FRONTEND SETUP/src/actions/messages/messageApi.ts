import axiosErrorHandler from "../../configure/axios/axiosErrorHandler";
import axiosInstance from "../../configure/axios/axiosInstance";




export async function FETCH_MESSAGE_BY_CHAT_ID_API(chatId:string) {
    try {
        const res = await axiosInstance.get(`/api/messages/${chatId}`);
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"FETCH_MESSAGE_BY_CHAT_ID_API");
    }
}



export async function SEND_MESSAGE_BY_CHAT_ID_API(chatId:string,content:string) {
    try {
        const res = await axiosInstance
        .post(`/api/messages/`,{
            chatId,
            content
        });
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"SEND_MESSAGE_BY_CHAT_ID_API");
    }
}
