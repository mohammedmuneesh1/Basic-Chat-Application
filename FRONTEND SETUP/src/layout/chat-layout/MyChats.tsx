import { useEffect, useState } from "react";
import { CREATE_GROUP_API, GET_CHAT_LIST_API } from "../../actions/chats/chatApi";
import type { ChatType } from "../../types/ChatType";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "../../context/ChatProvider";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { GET_USERS_BY_SEARCH } from "../../actions/users/usersApi";
import Swal from "sweetalert2";
import { useSocket } from "../../context/SocketContext";
import { socketSetup } from "../../utils/socket/socket";


const MyChats = ()=>{


  const {chatList,setChatList} = useChat();
  const [loading,setLoading] = useState(false);


    useEffect(() => {
  socketSetup.on("messageReceived", (newMessageReceived) => {
    setChatList((prevChats:ChatType[]) => {
      // Find if this chat already exists in the list
      const existing = prevChats.find(
        (c) => c._id === newMessageReceived.chat._id
      );

      if (existing) {
        // Update that chat’s latestMessage
        const updatedChats = prevChats.map((chat) =>
          chat._id === newMessageReceived.chat._id
            ? { ...chat, latestMessage: newMessageReceived }
            : chat
        );

        // Move this chat to the top
        const movedChat = updatedChats.find(
          (chat) => chat._id === newMessageReceived.chat._id
        )!;
        const others = updatedChats.filter(
          (chat) => chat._id !== newMessageReceived.chat._id
        );

        return [movedChat, ...others];
      } else {
        // If chat doesn’t exist (new chat), prepend it
        return [newMessageReceived.chat, ...prevChats];
      }
    });
  });

  return () => {
    socketSetup.off("messageReceived");
  };
}, [setChatList]);

    
    
    
    const {typingMap} = useSocket();


    const [userData,setUserData] = useState<null | {
        email:string;
        _id:string;
        name:string;
    }>(null);

    const [openGroupCreationModal,setOpenGroupCreationModal] = useState(false);
    


    const params = useParams();
    const navigate = useNavigate();

    //eslint-disable-next-line
    const [selectedChat,setSelectedChat] = useState(params?.chatId ?? "");



    useEffect(()=>{
        const getChatListFn = async()=>{
          setLoading(true);
            const res = await GET_CHAT_LIST_API();
            setLoading(false);
            // console.log('res from chat list',res);
            //  chatList:userChats,
            // userData,
            setChatList(res?.data?.chatList ?? []);
            setUserData(res?.data?.userData ?? null);
        }
        getChatListFn();
    },[]);

    const accessChatFn = (chatId:string)=>{
    //  customFn?.();
      navigate(`/chats/${chatId}`);
      return setSelectedChat(chatId);
    }


    const getInitial = (name:string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };
 

    return(

<div className="w-72 !h-screen bg-gray-100 !border-r !border-gray-300 flex flex-col overflow-auto">

      <div className="flex gap-3 justify-between items-center !px-4 !py-2">
      <h2 className=" font-bold text-lg border-b border-gray-300 ">
        My Chats
      </h2>

      <button
      onClick={()=>setOpenGroupCreationModal(true)}
       className="flex items-center gap-3 justify-start
        bg-gray-100 shadow-sm !px-3 !py-2 rounded-md
        !text-xs sm:!text-sm !cursor-pointer
        ">
        Group Chat
        <FaPlus/>
      </button>

      </div>

      <div className="!flex-1 overflow-y-auto  "  >

        {
          loading ? (
         <div className="flex !flex-col !gap-2">   
        { Array.from({ length: 10 }).map((_, index) => (
          <SkeletonGroupChatItem key={index} />
        ))}
        </div>   
          ):(
        chatList && chatList.map(
            //eslint-disable-next-line
            (userOrGroup:ChatType) => (
          <div
          onClick={()=>accessChatFn(userOrGroup._id)}
            key={userOrGroup._id}
            className={`!flex !items-center gap-3 !p-2 cursor-pointer  hover:bg-gray-300 !border-b  transition 
                ${userOrGroup._id === selectedChat ? '!bg-green-500' : ''} 
              
            `}
            // onClick={() => accessChatFn(userOrGroup)}
          >
            <div className="relative">

{(() => {
  const isGroupChat = userOrGroup?.isGroupChat === true; // true means Group Chat


  if (isGroupChat) {
    return (

        <div className="flex items-center gap-3 ">
        {userOrGroup?.pic ? (
          <img
            src={userOrGroup.pic}
            alt={userOrGroup.chatName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {getInitial(userOrGroup?.chatName ?? "")}
          </div>
        )}

                    <div className="flex-1 flex flex-col">
              <span className="font-semibold !text-sm">{userOrGroup?.chatName ?? "N/A"}</span>
            
            
              {/* {userOrGroup.latestMessage && (
                <h4 className="!text-xs text-gray-500 truncate">
                  {userOrGroup.latestMessage?.type === "text" && (
                    <span>
                        {userOrGroup?.latestMessage?.content ?? ""}
                    </span>
                  )}
                </h4>
              )} */}

                   {
                    typingMap[userOrGroup._id] ? (
                      <span className="!text-green-600 !text-sm">
                        Typing.....
                      </span>
                    ):(
                      userOrGroup.latestMessage?.type === "text" && (
                    <span className="!text-sm">
                        {userOrGroup?.latestMessage?.content ?? ""}
                    </span>
                  )
                      
                    )
                  }
            </div>


        
        </div>
    )
  } else {
    const theOtherUser = userOrGroup?.users?.find(
      (val) => val?._id !== userData?._id
    );

    return (
      <div className="flex items-center  gap-x-3">
        {theOtherUser?.pic ? (
          <img
            src={theOtherUser.pic}
            alt={theOtherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
           className="w-12 h-12 rounded-full bg-gradient-to-br
            from-blue-400 to-blue-600 flex 
           items-center justify-center text-white font-semibold !text-xs"
           >
            {getInitial(theOtherUser?.name ?? "")}
          </div>
        )}
            <div className="flex-1 flex flex-col !gap-0">
              <span className="font-semibold">{theOtherUser?.name ?? "N/A"}</span>
              {userOrGroup.latestMessage && (
                <h4 className="text-sm text-gray-500 truncate">
                  {
                    typingMap[userOrGroup._id] ?(
                      <span className="!text-green-600 !text-xs">
                        Typing.....
                      </span>
                    ):(
                      userOrGroup.latestMessage?.type === "text" && (
                    <span className="!text-xs">
                        {userOrGroup?.latestMessage?.content ?? ""}
                    </span>
                  )
                      
                    )
                  }
                  
                </h4>
              )}
            </div>
      </div>
    );
  }
})()}





            </div>


          </div>
        ))

          )
        }
        
      </div>

      <CreateGroupChatModal
      isOpen={openGroupCreationModal}
      closeModal={()=>setOpenGroupCreationModal(false)}
      
      />
    </div>
    )
}

export default MyChats;
 


// {
//     "_id": "68ef62b7cda3e34e5ca1a618",
//     "userKey": "68abf62ebdee966d43a21ef6_68c5af2851e4c184066e79d0",
//     "isGroupChat": false,
//     "__v": 0,
//     "chatName": "sender",
//     "createdAt": "2025-10-15T09:00:39.419Z",
//     "groupAdmin": [],
//     "updatedAt": "2025-10-15T09:02:35.571Z",
//     "users": [
//         {
//             "isActive": true,
//             "isDeleted": false,
//             "readReceiptsEnabled": true,
//             "_id": "68abf62ebdee966d43a21ef6",
//             "name": "guest login",
//             "email": "guest@example.com",
//             "isEmailVerified": true,
//             "role": "User",
//             "pic": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//             "createdAt": "2025-08-25T05:35:42.434Z",
//             "updatedAt": "2025-08-25T05:35:42.434Z",
//             "__v": 0
//         },
//         {
//             "isActive": true,
//             "isDeleted": false,
//             "readReceiptsEnabled": true,
//             "_id": "68c5af2851e4c184066e79d0",
//             "name": "asdfasdfasdf asdfasfasdf",
//             "email": "hello123@gmail.com",
//             "isEmailVerified": true,
//             "role": "User",
//             "pic": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//             "createdAt": "2025-09-13T17:51:36.540Z",
//             "updatedAt": "2025-09-13T17:51:36.540Z",
//             "__v": 0
//         }
//     ]
// }




interface CreateGroupChatModalProps{
  closeModal:()=>void;
  isOpen:boolean;
} 

const CreateGroupChatModal:React.FC<CreateGroupChatModalProps> = ({isOpen,closeModal})=>{
const [groupData, setGroupData] = useState<{
  name: string;
  members: {
    _id: string;
    name: string;
    email?: string;
  }[];
}>({
  name: "",
  members: [],
});

  const [searchQuery, setSearchQuery] = useState("");
const [filteredMembers, setFilteredMembers] = useState<{
    _id:string;
  name:string
}[]>([
]);


const {setChatList} = useChat();

const handleSearch = async (value:string) => {
  setSearchQuery(value);
  if (value.length > 0) {
    const result = await GET_USERS_BY_SEARCH(value);
    if(result?.success){
      setFilteredMembers(result?.data?.data ?? []);
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result?.response ?? "",
      })
     return setFilteredMembers([]);
    }
  } else {
    setFilteredMembers([]);
  }
};


const removeSelectedUser = (userId:string)=>{
  setGroupData((prev) => ({
    ...prev,
    members: prev.members.filter((member) => member._id !== userId),
  }));
}


const addUserFn = (userId:{_id:string,name:string,email?:string})=>{
  const isUserIdExist= groupData.members.some((member) => member._id === userId?._id);
  if(isUserIdExist){
    Swal.fire({
      icon: 'warning',
      title: 'Exist',
      text: "User already added",

    })
  }
  else{
    setGroupData((prev) => ({
      ...prev,
      members: [...prev.members, userId],
    }))
  }

};

const createChatGroupFn = async ()=>{
  // const {name,members} = groupData;

  if(!groupData?.name?.trim()){
    return Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: "Group name is required",
    })
  }
  if(groupData?.members?.length < 2){
    return Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: "Group should have at least 2 members",
    })
  }

  const res = await CREATE_GROUP_API({
    name:groupData?.name.trim(),
    users:groupData?.members.map((member) => member._id),
  });

  if(res?.success){
     Swal.fire({
      icon: 'success',
      title: 'Success',
      text: "Group created successfully",
    }).then(()=>{
      closeModal();
    });
    return setChatList((prev: ChatType[] | null) => {
      if(prev === null){
        return [
          res?.data
        ]
      }
      else{
        return [res?.data,...prev ]
      }
    });
  }
  else{
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: res?.response ?? "",
    })
  }
}



  return(
    isOpen && (
    <div 
    className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center  !px-2 sm:!px-4"
    >
    <div className="max-w-md w-full bg-white !p-4 rounded-md">


      {/*HEADING PART START */}
      <div className="flex items-center justify-between gap-4 !px-3">
        <h3>Create Group Chat</h3>
        <MdClose
        onClick={closeModal}
        className="!text-sm text-black"
        />
      </div>
      {/*HEADING PART CLOSE */}

      {/*BODY PART START */}
      <div 
      className="!space-y-3 !pt-3 !w-full"
      >

      <input 
      type="text"
      placeholder="Group Name"
      value={groupData.name}
      onChange={(e)=>setGroupData({...groupData,name:e.target.value})}
      className="!text-sm !py-2 !px-4 !w-full bg-gray-200 rounded-md"
      />

  <div className="relative">

    <div className="!flex flex-wrap gap-3 justify-start items-center !mb-1 " >
      {
        groupData?.members?.map((mem)=>(
          <div
          className="flex items-center !mt-3
          justify-start !px-3 !py-1 gap-3 !text-xs !bg-gray-100 !rounded-md"
          >
            {mem.name}
            <MdClose
            className=" text-black cursor-pointer"
            onClick={()=>removeSelectedUser(mem._id)}
            />
          </div>
        ))

      }
    </div>


    <input
      type="text"
      placeholder="Members Name"
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="!text-sm !py-2 !px-4 !w-full bg-gray-200 rounded-md"
    />

    {/* Dropdown Results */}
    {filteredMembers.length > 0 && (
      <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 max-h-40 overflow-y-scroll z-50">
        {filteredMembers.map((member, index) => (
          <div
            key={index}
            onClick={() => {
              addUserFn(member);
              // setGroupData(prev => ({ ...prev, members: [...prev.members, member] }));
              setSearchQuery("");
              setFilteredMembers([]);
            }}
            className="!px-4 !py-2 hover:bg-gray-100 cursor-pointer !text-sm !border-b"
          >
            {member?.name ?? "N/A"}
          </div>
        ))}
      </div>
    )}
  </div>




<button
onClick={()=>createChatGroupFn()}
  className="block !ml-auto !text-xs !bg-blue-400  !py-[10px] sm:!py-3 !px-3 !rounded-md text-white !font-semibold
  !cursor-pointer
  "
  >
    Create Chat
  </button>
  


  
      </div>
      {/*BODY PART END */}


      






    </div>
    </div>
    )
  )
};




const SkeletonGroupChatItem = () => {

  
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      {/* Profile Circle */}
      <div className="w-12 h-12 rounded-full bg-gray-300" />

      {/* Text Section */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Chat name */}
        <div className="w-1/3 h-4 bg-gray-300 rounded-md" />
        {/* Last message / typing indicator */}
        <div className="w-2/3 h-3 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};


