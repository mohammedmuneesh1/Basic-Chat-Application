// import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import { useEffect, } from "react";
import axiosInstance from "../configure/axios/axiosInstance";

// const TokenCheckerMiddleware:React.FC<{children:ReactNode}> = ({children})=>{


// interface TokenCheckerMiddlewareProps {
//   // children: ReactNode;
// }


const TokenCheckerMiddleware = () => {
  


const navigate = useNavigate();

useEffect(()=>{
  const checkIsProtectedFn =async()=>{

    try {
  const res = await axiosInstance.get(`/api/auth/api/protected`);
  console.log(res.status); // Only runs if status < 400
} 
//eslint-disable-next-line
catch (error: any) {
  console.log(error.response?.status); // <--- ✅ This is where 401 / 500 exists
  if (error.response?.status === 401) {
    navigate('/login', { replace: true });
  }
}
  }


  checkIsProtectedFn();
},[]);
return <Outlet />;
};
export default TokenCheckerMiddleware;


//   const token = Cookies.get("token");
//   const token123 = Cookies.get("token123");
//  console.log('token',token);
//  console.log('token',token123);
//  console.log("All Cookies:", document.cookie);


//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;

//     if (!decoded.exp || decoded.exp < currentTime) {
//       Cookies.remove("token");
//       return <Navigate to="/login" replace />;
//     }
//     else{
//        return  <Navigate to="/chat" replace />;
//     }
//   } catch {
//     Cookies.remove("token");
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;






    // const res = await axiosInstance.get(`/api/auth/api/protected`);
    // console.log('res',res?.status);
    // if(!res?.data?.success || res?.status === 401) {
    //    //ddont use return statement herre
    //   navigate('/login', { replace: true });  // Replaces current entry in browser history //User cannot click "Back" to return to previous page  // 
    // }