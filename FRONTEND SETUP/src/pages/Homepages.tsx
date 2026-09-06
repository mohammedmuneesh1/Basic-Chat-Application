import { useEffect } from "react";
import { useNavigate } from "react-router-dom";




const HomePages = ()=>{
  const navigate = useNavigate();

  useEffect(()=>{
     navigate('/chats');
  },[navigate]);
  
  
  // return navigate('/chats');
  

  return null;

}

export default HomePages;












  //   return(
  //       <div className=" h-screen ">
  //       <h1
  //       className="text-blue-600 bg-green-500"
  //       >
  //       ths is the home page 
  //       </h1>
  //  <Button colorPalette="teal" variant="solid">
  //       <RiMailLine /> Email
  //     </Button>
  //       </div>
  //   )