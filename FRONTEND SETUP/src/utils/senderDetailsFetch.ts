

//eslint-disable-next-line
export const getSender  =(loggedUserId:string,users:any[])=>{
    return users[0]?._id === loggedUserId ? users[1]?.name : users[0]?.name
}