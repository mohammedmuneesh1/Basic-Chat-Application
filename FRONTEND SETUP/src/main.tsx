import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "../src/components/ui/provider.tsx";




import './index.css'
import App from './App.tsx'
import { ChatProvider } from './context/ChatProvider.tsx';
import { SocketProvider } from './context/SocketContext.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ChatProvider>
      <SocketProvider>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
      </SocketProvider>
    </ChatProvider>
)
  {/* // </StrictMode>, */}