import { Server } from "socket.io";
import http from "http";





export const setupSocket = (server: http.Server) => {

  // Create a new Socket.IO server
  const io = new Server(server, {
      pingInterval: 25000,  // server sends ping every 25 seconds
    pingTimeout: 60000, // waits 60 seconds for a pong response
    
     //the amount of time it wait will wait 60 seconds before it goes off,
     //  if user didnt any mesage for 60 seconds,⚠️⚠️ it will close the connection to save the bandwidth ⚠️⚠️,
     //pingTimeout defines how long (in ms) the server waits for a pong response from the client after sending a ping. 
     //Default = 5000 ms (5 seconds)
     //It helps detect dead or inactive connections between client and server.
    cors: {
      origin: "*", // Replace "*" with your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  
  // Keep track of online users: { userId: socketId }
   const onlineUsers = new Map<string, string>();



//THE STRUCTURE OF .EMIT socket.emit(eventName, data?) is not built-in.





  // // ---------------- ⚠️ AUTHENTICATION MIDDLEWARE START ----------------
  // io.use((socket, next) => {
  //   try {
  //     const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

  //     if (!token) {
  //       console.log("❌ No token provided");
  //       return next(new Error("Authentication error: Token missing"));
  //     }

  //     // Token can come as "Bearer <token>", so split if needed
  //     const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

  //     const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET as string);

  //     // Attach user info to socket
  //     (socket as any).user = decoded;

  //     next(); // ✅ Allow connection
  //   } catch (err) {
  //     console.log("❌ Socket authentication failed:", err.message);
  //     next(new Error("Authentication error: Invalid token"));
  //   }
  // });
  // // ---------------- ⚠️ AUTHENTICATION MIDDLEWARE END ----------------














  //---------------------⚠️⚠️ HANDLE CLIENT CONNECTION START ⚠️⚠️ ---------------------
  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // ------------------------ LISTEN FOR MESSAGE TRIAL START -----------------------------------
    socket.on("message", (msg) => {
      console.log("📩 Message received:", msg);
      io.emit("message", msg); // Broadcast to all clients
    });
    // ------------------------ LISTEN FOR MESSAGE TRIAL END -----------------------------------

    //-----------------REGISTER A USER AFTER CONNECTION START -----------------------------------

    socket.on("setup", (userData:{_id:string}) => {
      onlineUsers.set(userData?._id, socket.id);
      console.log('onlineUsers',onlineUsers);

      console.log("✅ User online:", userData?._id);
      //Each user gets their own private room, named after their user ID.
      socket.join(userData?._id); //(NOT TO CREATE A ONE ONE CHAT BUT FOR ROOM) join a private room for 1-to-1 messages
      socket.emit("connected");// emit connected event
      //"connected" here is just a custom event name you defined.
    });


    //-----------------REGISTER A USER AFTER CONNECTION END -----------------------------------
    
    
    //-----------------JOIN GROUP/ROOM CHAT START -----------------------------------
    // Join group chat room
    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`🔹 ${socket.id} joined chat room: ${chatId}`);
    }); //SO WHAT HAPPEN IS WHEN WE CLICK ON ANY OF THE CHAT WITH THAT 
    // PARTICUALR USER AND OTHER USER  
//     User	Room joined
// Alice (id: "A1")	"A1"
// Bob (id: "B1")	"B1"
//Messages sent to io.to("A1") only go to Alice, and io.to("B1") only goes to Bob.
//✅ So yes, two users have two separate private rooms.



    //-----------------JOIN GROUP CHAT END -----------------------------------
    
    
    //-----------------LISTEN FOR NEW MESSAGE START -----------------------------------


    // Listen for new messages
    socket.on("newMessage", async (msgData) => {
    //  console.log('this is the msgeData',msgData);

        const chat = msgData.chat;

        if(!chat.users) return console.log('chat.users not defined');
        //if this group chat, and 5 users,
        //  and i'm part of it, it should be received to
        //  other 4 people not me


        chat.users.forEach((user:any)=>{
            if(user._id === msgData.sender._id) return;
            socket.in(user._id).emit('messageReceived',msgData);
        })





    //   try {
    //     const { chatId, senderId, content, type } = msgData;



    //     // Save message to DB
    //     const message = await MessageModel.create({
    //       sender: senderId,
    //       content,
    //       chat: chatId,
    //       type,
    //     });

    //     // Update latestMessage in chat
    //     await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message._id });

    //     // Emit message to **everyone in the chat room**
    //     io.to(chatId).emit("messageReceived", message);

    //     // Also send to individual users in 1-to-1 chat (optional)
    //     const chat = await ChatModel.findById(chatId).populate("users");
    //     chat?.users.forEach((user) => {
    //       if (user._id.toString() !== senderId && onlineUsers.has(user._id.toString())) {
    //         io.to(onlineUsers.get(user._id.toString())!).emit("messageReceived", message);
    //       }
    //     });

    //   } catch (err) {
    //     console.error("❌ Error sending message:", err);
    //   }
    });

    
    //-----------------LISTEN FOR NEW MESSAGE END -----------------------------------
 
 
    //----------------- SOCKET FOR TYPING START  -----------------------------------
 
    //-############### PREVIOUS VERSION START ####################-

 
    // socket.on('typing',(room)=>{

    //   console.log("first",room)
    //     socket.in(room).emit('typing',room);
    // });

    // socket.on('stopTyping',(room)=>{
    //     socket.in(room).emit('stopTyping',room);
    // });

    
    //-############### PREVIOUS VERSION END  ####################-

    //-############### V2 SOLUTION TO RECIEVE TYPING GLOBALLY OUTSIDE OF THE CHAT ID START ####################-
    socket.on('typing', (data: { chatId: string; senderId: string; users: any[] }) => {
  const { chatId, senderId, users } = data;
  console.log('users',users);

  users.forEach((user) => {
    if (user._id === senderId) return; // don't send back to self
    io.to(user._id).emit('typing', chatId); // emit to each user (even if not joined)
  });
});


socket.on('stopTyping', (data: { chatId: string; senderId: string; users: any[] }) => {
  const { chatId, senderId, users } = data;
  console.log('users stopTyping',users)
  console.log('users',Array.isArray(users));




  users.forEach((user) => {
    if (user._id === senderId) return;
    io.to(user._id).emit('stopTyping', chatId);
  });
});
    
    
    //-############### V2 SOLUTION TO RECIEVE TYPING GLOBALLY OUTSIDE OF THE CHAT ID END ####################-





    
    //----------------- SOCKET FOR TYPING END  -----------------------------------

    //----------------- SOCKET CLEANUP START  -----------------------------------
    socket.off('setup',()=>{
        console.log('user disconnected');
        socket.leave(socket.id);
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) onlineUsers.delete(key);
          });
    })
    
    //----------------- SOCKET CLEANUP END   -----------------------------------



    



    
    //-----------------REGISTER A USER AFTER CONNECTION END -----------------------------------







    //-----------------------⚠️⚠️  HANDLE DISCONNECT START ⚠️⚠️ ---------------------------------------------
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      console.log(`❌ disconnection reason: ${reason}`);

      // Remove from online users
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) onlineUsers.delete(key);
      });

//   socket.leave(roomName) removes the socket from a specific room.
// However:
// Each socket automatically leaves all its rooms when it disconnects.
// That includes rooms named after socket.id, or user._id, or chat rooms the user joined.
// So:
// ✅ You don’t need to call socket.leave() manually inside disconnect.
// Unless:
// You’re doing something unusual like persisting rooms across reconnects (not your case right now).


// Every connected client is represented by a socket instance.
// When the connection is closed, that socket is destroyed —
// and Socket.IO automatically removes it from all rooms it was part of.

// It’s automatically removed from:
// Its own private room (based on socket.id)
// Any user room (like user._id)
// Any chat room (like chatId)
// No manual .leave() calls are needed.


    });
    //-----------------------⚠️⚠️  HANDLE DISCONNECT END ⚠️⚠️ ---------------------------------------------




  });

  //---------------------⚠️⚠️ HANDLE CLIENT CONNECTION END ⚠️⚠️ ---------------------

  return io;
};




//NOTE ABOUT SOCKET.JOIN() BELOW (BOTTOM )

//------------------------- SOCKET IO NOTES START ---------------------------------------------------


//here disconnect is a event, like wise 
// ⚙️ 1. io.on("connection", ...)

// 🔹 What it means:
// This event is fired whenever a new client connects to your Socket.IO server.

// Think of it like:
// 🧍 Client joins your server → “connection” event triggers
// 🔹 What you get:

// The callback gives you a socket object → it represents that one specific connected user. (ONE SPECIFIC USER SOCKET ID  )
// " IMP----->  Each connected user has a unique ID (socket.id) so you can track or message them individually. "


// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);
// });

//📍If 3 users open your site → this “connection” event runs 3 times, once for each.



// 💬 2. socket.on("message", (msg) => {...})
// 🔹 What it means:

// This listens for a custom event called "message" from the client.
// The client must send this event using:

// socket.emit("message", "Hello from client!");

// 🔹 What happens inside:
// Whenever the client sends a "message" event, the server receives it here.
// Then the server logs it and broadcasts it to everyone:
// io.emit("message", msg);
// io.emit() → sends the message to all connected clients (including the sender)
// If you want to send to everyone except the sender, use:

// socket.broadcast.emit("message", msg);

// 💬 Analogy:

// 🧍 Client says: “Hello everyone!”
// 📡 Server hears it → repeats “Hello everyone!” to everyone else in the room.



// ❌ 3. socket.on("disconnect", ...)
// 🔹 What it means:

// This event fires automatically when a client disconnects (closes browser, loses internet, etc.)

// Socket.IO handles this for you — no need for custom code on the client side.





// ❌ 3. socket.on("disconnect", ...)
// 🔹 What it means:

// This event fires automatically when a client disconnects (closes browser, loses internet, etc.)

// Socket.IO handles this for you — no need for custom code on the client side.



// You can use this to:
// Remove the user from a list
// Notify others that the user left
// Clean up memory or rooms




//------------------------- SOCKET IO NOTES END ---------------------------------------------------


// "reconnect"
// Fired when a client successfully reconnects
// Auto reconnection happens

// socket.on("chatMessage", ...)
// socket.on("userTyping", ...)
// socket.on("joinRoom", ...)
// socket.on("newNotification", ...)



//------------------------------------------------ 1️⃣ What socket.join(roomName) does---------------------------------------------------

// 1) It adds the socket to a room with the name roomName.
// 2) If the room doesn’t exist yet, Socket.IO automatically creates it.
// 3) If the room already exists, the socket is added to that room.
// 4) Rooms in Socket.IO are just logical channels,

// Alice and Bob chat, chatId = "chat_123"

// socket.join("chat_123");
// 1) Alice’s socket joins "chat_123".
// 2) Bob’s socket joins "chat_123".
// 3) Now any message emitted to "chat_123" goes to both of them.

// Example 2: Group chat
// // Group chat with 4 members, chatId = "group123"
// socket.join("group123");


// Each user’s socket joins "group123".

// Emitting to "group123" delivers the message to all 4 users.

//socket.join() does not create a “group” in your database.
//  It’s just a temporary in-memory room managed by Socket.IO.



//setup event 



// socket.join(userData._id);

// This adds the socket to a “room” with the name userData._id.
// If the room doesn’t exist yet, Socket.IO
//  automatically creates it.
// If the room already exists (another socket already joined it),
//  your socket is simply added to it.
// Rooms in Socket.IO are just in-memory channels for
//  sending messages. They are not groups in your

// Room name = the user’s ID (like "12345").  //INPRIVETE WAY 
// Only this user’s socket(s) join this room.

// Purpose: send messages specifically to this user.

// io.to("12345").emit("message", { text: "Hello!" });
//→ Only user "12345" receives it.

//MY DEFINITION ->
//  IF PRIVATE JOIN(LIKESETUP EVENT JOIN) IT WILL CREATE A
//  ROOM WITH USER FOR MESSAGE TO PARITCUALRY RECEIVE TO THAT
//  USER 

//Group chat / chat room 

//socket.join(chatId); 
// Room name = a chat ID, not a user ID.
// All users in that chat join the same room.
// Purpose: broadcast messages to all members of that chat.

//io.to("group123").emit("message", { text: "Hello everyone!" });

// → All users in "group123"
//  (e.g., Alice, Bob, Charlie) receive it.
// So a group always has its own name,
//  usually a unique chatId from your database.
// It is NOT the same as userData._id.
//  userData._id is only for the private room of that user.













//------------------------------------------------ 1️⃣ What socket.join(roomName) END ---------------------------------------------------
