import axiosErrorHandler from "../../configure/axios/axiosErrorHandler";
import axiosInstance from "../../configure/axios/axiosInstance";


export async function ACCESS_CHAT_BY_ID(uId:string){
    try {
        const res = await axiosInstance.post('/api/chats/one-to-one',{userId:uId});
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"ACCESS_CHAT_BY_ID");
    }
}


export async function GET_CHAT_LIST_API(){
    try {
        const res = await axiosInstance.get('/api/chats/');
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"GET_CHAT_LIST_API");
    }
}


export async function CREATE_GROUP_API(obj:object){
    try {
        const res = await axiosInstance.post('/api/chats/group',obj);
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"CREATE_GROUP_API");
    }
}

// export async function GET