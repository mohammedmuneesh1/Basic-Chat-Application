import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePages from './pages/Homepages'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/loginPage'

import { Toaster} from './components/ui/toaster'
import TokenCheckerMiddleware from './middlewares/TokenCheckerMiddleware'
import ChatByIdPage from './pages/ChatByIdPage'

function App() {
  
  return (
    <div className='App'>

        {/* LAYOUT MIDDLEWARE COMPOENT START */}
         <Toaster
         />
        {/* LAYOUT MIDDLEWARE COMPOENT END */}



          <Routes>


      {/* <Route path="/" element={
        <TokenCheckerMiddleware>
          <HomePages />
        </TokenCheckerMiddleware>
        } />
      
      <Route path="/chats" element={
        <TokenCheckerMiddleware>
             <ChatPage />
         </TokenCheckerMiddleware>
        } />
      <Route path="/chats" element={
        <TokenCheckerMiddleware>
             <ChatPage />
         </TokenCheckerMiddleware>
        } /> */}

          <Route
         element={<TokenCheckerMiddleware />}
          >
    <Route path="/" element={<HomePages/>} />
    <Route path="/chats" element={<ChatPage />} />
    <Route path="/chats/:chatId" element={<ChatByIdPage />} />
    {/* <Route path="/profile" element={<ProfilePage />} />
    <Route path="/settings" element={<SettingsPage />} /> */}
  </Route>



      <Route path="/login" element={<LoginPage/>} />

      {/* <Route path="/about" element={<AboutPage />} /> */}

      {/* catch-all route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
    </div>
  )
}

export default App






{/* {
    formData && (
        <pre className="bg-blue-300">
            <code className="text-gray-500">
                {
                    JSON.stringify(formData,null,2)
                }
            </code>
        </pre>
    )
} */}