import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_CHAT_BY_ID } from "../../actions/chats/chatApi";
import Swal from "sweetalert2";
import { useChat } from "../../context/ChatProvider";
import type { ChatType } from "../../types/ChatType";
// import { useChat } from "../../context/ChatProvider";





interface UserListItemInterface{
    data:{
        _id:string;
        name:string;
        isOnline?:string;
        role?:string;
    }
    isUnderline?:boolean;
    customFn?:()=>void;
}

const UserListItem:React.FC<UserListItemInterface>
 = ({data,isUnderline=false,customFn})=>{

    const getInitial = (name:string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const params = useParams();
  const {setChatList} = useChat();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const {chats,setSeletedChat} = useChat();

  const navigate = useNavigate();

    const accessChatFn =async (userId:string)=>{
      const res = await ACCESS_CHAT_BY_ID(userId);
      console.log('accessChatFn',res);
      if(res?.success){
        const chatId = res?.data?._id;
        
setChatList((prev:null | ChatType[] ) => {
  // If prev is null or undefined, just create a new array with the new chat
  if (!prev || prev.length === 0) {
    return [res?.data];
  }
  // Check if chat already exists
  const exists = prev.some((val) => val?._id === chatId);
  return exists ? prev : [ res?.data,...prev,];
});
        customFn?.();
       return navigate(`/chats/${chatId}`);
      }
      else{
        Swal.fire({
           icon:'error',
           title:"Technical Issue",
           text:res?.data?.response ?? "",
        })
      }

    }


    return (
    <div 
    onClick={()=>accessChatFn(data?._id)}
    className={`flex items-center gap-3 
     hover:bg-gray-100 cursor-pointer
      transition-colors 
      ${isUnderline &&  `!border-b border-gray-500`}  !pb-2
      ${params?.userId === data?._id && `!bg-green-400`}
      `}
      
      // className={`flex items-center gap-3 p-3
      //  hover:bg-gray-100 
      //  cursor-pointer transition-colors
      //   border-b-2 border-black
      //     `}
    //   onClick={onClick}
    // ${isUnderline && ' border border-b-2'}
    >

      {/* AVATAR START */}
      
      <div className="relative flex-shrink-0">


        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
          {getInitial(data?.name ?? "")}
        </div>




        {/* Online indicator */}
        {data?.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
          </div>
        )}
      </div>
      {/* AVATAR END */}

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p 
        className="text-gray-900
         font-medium truncate
         ">{data?.name ?? ""}
         </p>
      </div>
    </div>
    )
}

export default UserListItem;

// {_id: '68c63fe56724ce5bc3e8e690', name: 'guest hello ', role: 'User'}


