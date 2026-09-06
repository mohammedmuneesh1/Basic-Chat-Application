import React from 'react';
import { useState } from 'react';

import { useEffect, useRef } from 'react'
import ChatLayout from '../layout/chat-layout/ChatLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { isValidMongoId } from '../utils/isValidMongoId';
// import { ACCESS_CHAT_BY_ID } from '../actions/chats/chatApi';
import Loader from '../components/Loader';
import { LuSend } from 'react-icons/lu';
import { FETCH_MESSAGE_BY_CHAT_ID_API, SEND_MESSAGE_BY_CHAT_ID_API } from '../actions/messages/messageApi';
import type { ChatByIdMessageType } from '../types/ChatType';
import Cookies from 'js-cookie'
import { formatDate } from '../utils/formatDate';
import Swal from 'sweetalert2';
import ScrollableFeed from 'react-scrollable-feed'
import { socketSetup } from '../utils/socket/socket';
import { useSocket } from '../context/SocketContext';



 const ChatByIdPage = () => {
    const [loading,setLoading] = useState<boolean>(false);
    const loggedUserId = Cookies.get('uId');
    console.log('loggedUserId ',loggedUserId);
    
    const { chatId } = useParams<{ chatId: string }>(); 
    const {typingMap,socketConnected,notification,setNotification} = useSocket();

      //eslint-disable-next-line
      const [chatMessages,setChatMessages] = useState<ChatByIdMessageType[]>([]);
      const [chatData,setChatData] = useState<null | {
        _id:string;
        users:{_id:string,name:string,email:string,pic:string}[],
        isGroupChat:boolean;
        chatName:string;
      }>(null);

      const [chatIdState,setChatIdState] = useState<string>('');
      const [typing ,setTyping] = useState<boolean>(false);
      const navigate = useNavigate();



      //--------------------------------------- SOCKET IO USE EFFECT START ----------------------------
      // ..⚠️⚠️⚠️ CURRENTLY MOVED TO SOCKET PROVIDER GLOBAL START ⚠️⚠️⚠️..
    //   useEffect(()=>{

    //     socketSetup.on('connect',()=>{
    //       console.log('socket connected');
    //     });

    //     // socketSetup.emit('message',"hello how are you");
    //     socketSetup.emit('setup',{_id:loggedUserId});

    //     socketSetup.on('connected',()=>{
    //       setSocketConnected(true)
    //     });


    //     socketSetup.on("disconnect", () => {
    //      console.log("Disconnected from server");   
    //     });

    //     //----TYPING START ------------------
    //     socketSetup.on('typing',()=>{
    //       setIsTyping(true);
    //     });

    //     socketSetup.on('stopTyping',()=>{
    //       setIsTyping(false);
    //     });


    //     //----TYPING END ------------------



    // return ()=>{
    //   socketSetup.off('connect');
    //   socketSetup.off('message');
    //   socketSetup.off('disconnect');
    // }
    // },[]);

      //--------------------------------------- SOCKET IO USE EFFECT END ----------------------------
      
useEffect(() => {
  const handleMessageReceived =
  //eslint-disable-next-line
   (newMessageReceived:any) => {
    if (!chatIdState || chatIdState !== newMessageReceived.chat._id) {
      // show notification logic here
      if(!notification.includes(newMessageReceived)){
        setNotification((prev) => [newMessageReceived,...prev]);
      }

    }
    else {
      setChatMessages((prev) => [...prev, newMessageReceived]);
    }
  };

  socketSetup.on("messageReceived", handleMessageReceived);

  // ✅ Clean up on unmount
  return () => {
    socketSetup.off("messageReceived", handleMessageReceived);
  };
}, [chatIdState]);


      //--------------------------------------- API FOR FETCHING USER MESSAGES START ----------------------------
      useEffect(()=>{
        const fetchMessageByChatId = async ()=>{
          if(!chatId || (chatId && !isValidMongoId(chatId))) {
                navigate(-1) // 🔙 Goes back one step in browser history
            }
            else{
              setChatIdState(chatId);
                setLoading(true);
                const res = await FETCH_MESSAGE_BY_CHAT_ID_API(chatId);
                console.log('res by chat id ',res);
                setLoading(false);
                if(res?.success){
                    setChatMessages(res?.data?.messageData ?? []);
                    setChatData(res?.data?.chatData ?? null);
                    socketSetup.emit('joinChat',chatId);

                }
                else{
                    navigate(-1);
                }
            }
        }
        fetchMessageByChatId();
        // selectedChatCompare = chatId;

      },[chatId]);
      //--------------------------------------- API FOR FETCHING USER MESSAGES END ----------------------------


// isValidMongoId





//--------------------- DEMO DATA START -----------------------------------

  const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([
  //   { id: 1, content: 'Hey! How are you?', isOwn: false, time: '10:30 AM' },
  //   { id: 2, content: 'I am doing great, thanks!\nHow about you?', isOwn: true, time: '10:31 AM' },
  //   { id: 3, content: 'Pretty good! Working on a new project.', isOwn: false, time: '10:32 AM' },
  // ]);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef =  useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//       if(messagesEndRef.current){
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }

//   }, [messages]);


   // Auto-resize textarea



    const handleSend = async()=> {

      if (message.trim()) {
      const senderData = chatData && chatData?.users?.find((user)=>user?._id === loggedUserId); 
       socketSetup.emit('stopTyping',{chatId: chatData?._id,
         senderId: senderData?._id,
          users:chatData?.users ? chatData?.users : [],
         }); 
      const res = await SEND_MESSAGE_BY_CHAT_ID_API(chatIdState,message);
      if(res?.success){
        console.log('res from sending message ',res?.data);
        socketSetup.emit('newMessage',res?.data);
        setChatMessages([...chatMessages, res?.data]);
        setMessage('');
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res?.response ?? "",
        })
      }
      

      // setchatMessages([...messages, newMessage]);
    }
  };



 const handleKeyDown =
 //eslint-disable-next-line
 (e:any) => {
    // Enter to send (without Shift or Ctrl)
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
    // Ctrl+Shift+Enter for line break (handled automatically by textarea)
    // Shift+Enter for line break (handled automatically by textarea)
  };









//--------------------- DEMO DATA END -----------------------------------





const lastTypingTimeRef = useRef(0);
const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


const typingHandler = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
  setMessage(e.target.value);
  //typing indicator logic 
  if(!socketConnected) return;

  const senderData = chatData && chatData?.users?.find((user)=>user?._id === loggedUserId);
  console.log('senderData ',senderData);
  

  if(e.target.value === "") {
    setTyping(false);
    return socketSetup.emit('stopTyping',
       {chatId: chatData?._id,
         senderId: senderData?._id,
          users:chatData?.users ? chatData?.users : [],
         }
        );
  }




  if(!typing){
    setTyping(true);
    // socketSetup.emit('typing',chatIdState);
    socketSetup.emit('typing',
      { chatId: chatData?._id,
         senderId: senderData?._id,
          users:chatData?.users ? chatData?.users : [],
         }
        );
  }

  lastTypingTimeRef.current = new Date().getTime();
 console.log('lastTypingTimeRef.current',new Date().getTime());


 //IF A USER CONTINUSLY TYPE 3 CHARACTERS, FUNCTION RE-RENDERS 
 // THE  REF WILL SAVE IT IRRESPECTIVE OF THE PREVIOUS TYPINGtIMEOUTRE
 // SO ONCE FINDOUT FIRST TWO HAVE TYPINGTIMEOUTREF.CURRENT, CLEAR IT 
 //BECAUSE WE NEED LATEST ONE 
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }



  const timerLength = 1500;
    // setTimeout() starts running immediately when it’s called.
// Assigning it to .current doesn’t delay or pause it — 
// it just stores the timer ID that setTimeout returns.
//The JavaScript engine immediately schedules your callback to execute after timerLength ms (1.5 seconds).
//setTimeout() instantly returns a numeric ID (e.g., 42).
    typingTimeoutRef.current = setTimeout(() => {
    const timeNow = new Date().getTime();
    console.log('timeNow',timeNow);
    const timeDiff = timeNow - lastTypingTimeRef.current;

    if (timeDiff >= timerLength) {
      setTyping(false);
      socketSetup.emit('stopTyping',  { chatId: chatData?._id,
         senderId: senderData?._id,
          users:chatData?.users ? chatData?.users : [],
         });
    }
  }, timerLength);
}


if(loading) return <Loader/>

  return (
  <>
  <ChatLayout>
    <div className="flex flex-col !h-full  bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="User"
            className="!w-10 !h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-gray-900">John Doe</h2>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
        <ScrollableFeed>
      <div className="flex-1 !overflow-y-auto  !px-3  !py-4 !space-y-3">

        {chatMessages && chatMessages?.length > 0 ? chatMessages.map((msg) => (
          <MessageBubble 
          key={msg._id}
          message={msg} 
          isOwn={msg?.sender._id === (loggedUserId ?? "") }
          // loggedUserId={loggedUserId ?? "" } 
          
          />
        )):(
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/*THE TYPING  ANIMATION OF TEXT FOR USER START */}

      {/* '!justify-end
      <div
        className={`max-w-[70%] ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : ''
        }`}
      > */}
    {
      /*IS TYPING  */
    }


    {
      typingMap[chatIdState] && (
       <div className="flex items-center space-x-1 !gap-1
          !ml-1 !mb-4 rounded-lg !px-4 !py-2 !bg-gray-200 !w-fit
          text-gray-900 rounded-bl-none">
      <span className="w-2 h-2 bg-gray-500 rounded-full
       animate-bounce [animation-delay:0ms]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full 
      animate-bounce [animation-delay:200ms]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full
       animate-bounce [animation-delay:400ms]"></span>
    </div>
      )
    }





      {/*THE TYPING  ANIMATION OF TEXT FOR USER END */}
        </ScrollableFeed>




      {/* Input Area */}
      <div className="bg-white border-t border-gray-300 px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => typingHandler(e)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              className="w-full bg-transparent outline-none resize-none max-h-[120px] text-sm text-gray-900 placeholder-gray-500"
              rows={5}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <LuSend size={20} />
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-2">
          Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-gray-600">Enter</kbd> to send, 
          <kbd className="px-1 py-0.5 bg-gray-200 rounded text-gray-600 ml-1">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  </ChatLayout>
 </>
  )

}

export default ChatByIdPage;



/* eslint-disable */
const MessageBubble = ({ message, isOwn,
  // eslint-disable-next-line
   }:{message:ChatByIdMessageType, isOwn:any,}) => {
  

    return (
    <div className={`flex gap-1 ${isOwn ? '!justify-end' : '!justify-start'} !mb-4`}>
      
      {
        !isOwn && (
          <div
          className='!w-10 !h-10 rounded-full !overflow-hidden'
          >
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="User"
              className="object-cover w-full h-full"
            />
          </div>

        )
      }


      <div
        className={`max-w-[70%] rounded-lg !px-4 !py-2 ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p 
        className="!text-sm whitespace-pre-wrap break-words">
          {message.content ?? "N/A"}
          </p>
        <span className={`!text-xs ${isOwn ? '!text-blue-100' : '!text-gray-500'} mt-1 block`}>
          {formatDate(message.createdAt ?? "")}
        </span>
      </div>

      
    </div>
  );
};
