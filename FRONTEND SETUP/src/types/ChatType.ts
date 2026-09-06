export interface UserType {
  isActive: boolean;
  isDeleted: boolean;
  readReceiptsEnabled: boolean;
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: "User" | "Admin" | string;
  pic: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  __v: number;
}

export interface ChatType {
  _id: string;
  isGroupChat: boolean;
  userKey: string;
  pic?:string;
  latestMessage:MessageType;
  chatName: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  groupAdmin: UserType[]; // or string[] if only IDs are stored
  users: UserType[];
  __v: number;
}



export interface MessageType {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email?: string;
    pic?: string;
  } | string; // In case it's not populated
  content: string;
  chat: string | {
    _id: string;
    chatName?: string;
    isGroupChat?: boolean;
  };
  type: "text" | "image" | "video" | "file";
  isDeleted: boolean;
  readBy: Array<{
    user: string | {
      _id: string;
      name: string;
      pic?: string;
    };
    readAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}




export interface ChatByIdMessageType {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    pic: string;
  };
  chat: {
    _id: string;
    chatName: string;
    //eslint-disable-next-line
    groupAdmin: any[]; // can be refined if you know the structure
    users: {
      _id: string;
      name: string;
      email: string;
      pic: string;
    }[];
  };
  content:string;
  type: 'text' | 'image' | 'video' | 'file' | string; // extendable
  isDeleted: boolean;
  readBy: string[]; // assuming array of user IDs
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
