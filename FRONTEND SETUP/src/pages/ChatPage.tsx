// import { useEffect, useState } from "react";
// import axios from "axios";
// import axiosInstance from "../configure/axios/axiosInstance";
// import Loader from "../components/Loader";

import ChatLayout from "../layout/chat-layout/ChatLayout";

const ChatPage = ()=>{
    //eslint-disable-next-line
    // const [chats,setChats] = useState([]);

    // const fetchChats = async ()=>{
    //     const res = await axiosInstance.get('/api/chats/');
    //     if(res?.data?.success){
    //         setChats(res?.data?.data);
    //     }
    // }

    // useEffect(()=>{
    //     fetchChats();
    // },[])

    return(
      <>
  <ChatLayout>
<>
<h2>hello world</h2>

</>
 </ChatLayout>
      </>
    )
}

export default ChatPage;









//COMMENTED CODE 

//   useEffect(() => {
//         // Save to localStorage
//         localStorage.setItem('theme', theme);
        
//         // Apply both class and data-theme attribute for maximum compatibility
//         document.documentElement.classList.toggle('dark', theme === 'dark');
//         document.documentElement.setAttribute('data-theme', theme);
        
//         console.log('Theme changed to:', theme); // Debug log
//         console.log('HTML element classes:', document.documentElement.className);
//         console.log('HTML data-theme:', document.documentElement.getAttribute('data-theme'));
//     }, [theme]);

//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light');
//   };



 {/* <div className="bg-white dark:bg-blue-500 min-h-screen p-4 transition-colors duration-200">
            <h1 className="text-black dark:text-white text-2xl mb-4">This is the chat page</h1>
            <button 
                onClick={toggleTheme} 
                className="p-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg border dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded">
                Current theme: {theme}
            </div>
        </div> */}

        //     const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');