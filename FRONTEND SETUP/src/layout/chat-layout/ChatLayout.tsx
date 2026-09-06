import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import type { ReactNode } from "react";


const ChatLayout:React.FC<{children:ReactNode}> = ({children})=>{
    return(
      <div className="w-full max-w-full h-screen flex flex-col !bg-red-400 !overflow-hidden">
  <SideDrawer />

  {/* The content area */}
  <div className="flex flex-1 overflow-hidden !bg-blue-400">
    <MyChats />
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </div>
</div>
    )
}

export default ChatLayout;