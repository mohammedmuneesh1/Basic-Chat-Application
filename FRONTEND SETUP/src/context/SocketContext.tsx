import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { socketSetup } from "../utils/socket/socket";

type TypingMap = Record<string, boolean>; // chatId → isTyping

const SocketContext = createContext<{
  socketConnected: boolean;
  typingMap: TypingMap;
  //eslint-disable-next-line
  notification:any[],
  //eslint-disable-next-line
  setNotification:React.Dispatch<React.SetStateAction<any[]>>;
} | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingMap, setTypingMap] = useState<TypingMap>({});
  //eslint-disable-next-line
  const [notification,setNotification] = useState<any[]>([])
  const loggedUserId = Cookies.get("uId");

  useEffect(() => {
    if (!loggedUserId) return;
    
  // Clean up any previous listeners before setting new ones
  // socketSetup.off("connected");
  // socketSetup.off("disconnect");
  // socketSetup.off("typing");
  // socketSetup.off("stopTyping");




    socketSetup.emit("setup", { _id: loggedUserId });

    socketSetup.on("connected", () => {
      console.log("✅ socket connected globally");
      setSocketConnected(true);
    });

    socketSetup.on("disconnect", () => {
      console.log("❌ socket disconnected globally");
      setSocketConnected(false);
    });

    // ✅ handle typing events globally
    socketSetup.on("typing", (chatId: string) => {
      console.log("typing",chatId);
      setTypingMap(prev => ({ ...prev, [chatId]: true }));
    });

    socketSetup.on("stopTyping", (chatId: string) => {
      setTypingMap(prev => ({ ...prev, [chatId]: false }));
    });

    return () => {
      socketSetup.off("connected");
      socketSetup.off("disconnect");
      socketSetup.off("typing");
      socketSetup.off("stopTyping");
    };
  }, [loggedUserId]);


  console.log('notification',notification);
  console.log('socketTyping ',typingMap);

  return (
    <SocketContext.Provider value={{ 
      socketConnected,
       typingMap,
       notification,
       setNotification
       }}>
      {children}
    </SocketContext.Provider>
  );
};

//eslint-disable-next-line
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};

