import axiosErrorHandler from "../../configure/axios/axiosErrorHandler";
import axiosInstance from "../../configure/axios/axiosInstance";


export async function GET_USERS_BY_SEARCH(searchTxt:string){
    try {
        const res = await axiosInstance.get(`/api/users/search/profile?search=${searchTxt}`);
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"GET_USERS_BY_SEARCH");
    }

}