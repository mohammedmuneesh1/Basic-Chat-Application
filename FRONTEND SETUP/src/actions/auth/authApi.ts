import axiosErrorHandler from "../../configure/axios/axiosErrorHandler";
import axiosInstance from "../../configure/axios/axiosInstance";


export const REGISTER_USER = async (formDataObj:FormData)=>{
    try {

        console.log('formDataObj',formDataObj);

        const res = await axiosInstance.post('/api/auth/users/registration/skip-verification',formDataObj,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            }
        );
        return res?.data;
        
    }
     catch (error) {
        return await axiosErrorHandler(error,"REGISTER_USER");
    }
}


export const LOGIN_USER = async (email:string,password:string)=>{
    try {
        const res = await axiosInstance.post('/api/auth/user/login',{email,password},{
            withCredentials: true,
        });
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"LOGIN_USER");
    }
}


export const LOGOUT_USER_FN = async ()=>{
    try {
        const res = await axiosInstance.post('/api/auth/user/logout',{
            withCredentials: true,
        });
        return res?.data;
    }
     catch (error) {
        return await axiosErrorHandler(error,"LOGOUT_USER_FN");
    }
};
