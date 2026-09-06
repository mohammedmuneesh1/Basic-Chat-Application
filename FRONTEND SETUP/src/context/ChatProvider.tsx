import { createContext,  useState } from 'react';
import type { ReactNode } from 'react';
import Cookies from "js-cookie";
// Define what your ChatContext will store (add actual values later)
interface ChatProviderType {
    hello:string;
    userData:null | object;
    selectedChat:null | string;
    setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>; 
    //eslint-disable-next-line
    chatList:ChatType[] | null,
    //eslint-disable-next-line
    setChatList:React.Dispatch<React.SetStateAction<any>>; 
    //eslint-disable-next-line
    setUserData:React.Dispatch<React.SetStateAction<any>>;

}

// Create the context

//eslint-disable-next-line
export const ChatContext = createContext<ChatProviderType | null>(null);

// Props type for the provider
interface ChatProviderProps {
  children: ReactNode;
}

// Provider component
export const ChatProvider = ({ children }: ChatProviderProps) => {

  //eslint-disable-next-line
  const [userData,setUserData] = useState<null | object>(()=>{
    const isUserDataExist = Cookies.get('userData');
    if(isUserDataExist){
         try {
      return JSON.parse(isUserDataExist);
    } catch (err) {
      console.error("Invalid JSON in userData cookie:", err);
      Cookies.remove("userData"); // optional: clean up invalid cookie
    }
  }
    return null;
  });

  const params = useParams();

  const [selectedChat,setSelectedChat] = useState<string | null>(params?.chatId && isValidMongoId(params?.chatId)?params.chatId:null);
 //eslint-disable-next-line

  const [chatList,setChatList] = useState<ChatType[] | null>(null);

  const contextValue: ChatProviderType = {
    hello: 'world',
    userData,
    selectedChat
  ,setSelectedChat,
  chatList,
  setChatList,
  setUserData,
  };
  
  return (
  //eslint-disable-next-line
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};



import { useContext } from "react";
import type { ChatType } from '../types/ChatType';
import { useParams } from 'react-router-dom';
import { isValidMongoId } from '../utils/isValidMongoId';


//eslint-disable-next-line
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};







