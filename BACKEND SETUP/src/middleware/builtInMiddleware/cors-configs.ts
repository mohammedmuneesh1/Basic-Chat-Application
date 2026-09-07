import cors from "cors";

 const corsConfig = cors({
    // origin:"*",
     origin:process.env.NODE_ENV === 'production' ? ['https://yourdomain.com', 'https://www.yourdomain.com'] :
      ['http://localhost:3000', 
        'http://localhost:3001',
        'http://localhost:5173',
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Authorization",
         "Content-Type",
         "X-API-KEY",
        ],
        credentials: true,   // in frontend we need to pass  withCredentials: true (get token automatically),  so we have to make credentials true,
    maxAge: 86400, // Cache preflight results for 24 hours  (example: browser send a put request perflight , server will indicate positive then actual put call where made,so maxAge will cache this preflight value and no need to send every time a preflight. Thank you.)
});

export default corsConfig;



// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
//     : ['http://localhost:3000', 'http://localhost:3001'],
//   credentials: true,
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));