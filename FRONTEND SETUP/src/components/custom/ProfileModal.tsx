import {  Image, } from "@chakra-ui/react";
import {  type ReactNode } from "react";
import { MdClose } from "react-icons/md";


interface ProfileModalInterface { 
    
    user:null | object;
    children?:ReactNode;
    isOpen:boolean;
    closeModal:()=>void;
    handleModal:(val:boolean)=>void
    
}

//eslint-disable-next-line
const ProfileModal:React.FC<ProfileModalInterface> = ({children,isOpen,handleModal})=>{


    //   const [openModal,setOpenModal] = useState(false);

    return(
        <>
        <span
        onClick={()=>handleModal(true)}
        //  onClick={()=>setOpenModal(!openModal)}
            >
        {children}
        </span>
        {isOpen && (
            <div
            className="fixed inset-0 z-[999] bg-black/40 flex flex-col justify-center items-center">
                <div className="max-w-md w-full bg-white  h-[30vh]  rounded-md ">


{/*THE TOP USER PROFILE SECTION WITH CLOSE BAR START */}
<div className="!py-4 !px-8 gap-3 flex items-center justify-between border border-b-black">
<h1 className="text-md lg:text-lg">User Profile</h1>
<MdClose
onClick={()=>handleModal(false)}
className=" text-sm sm:text-md md:text-xl"/>
</div>
{/*THE TOP USER PROFILE SECTION WITH CLOSE BAR END */}


{/*THE USER IMAGE SECTION START */}

<div className=" flex flex-col items-center">
    <div className="w-30 h-30 md:w-32
     md:h-32 rounded-full
       overflow-hidden"
       >
        <Image
        src="https://bit.ly/sage-adebayo"
        alt="user image"
        />
    </div>
</div>
{/*THE USER IMAGE SECTION END */}
                </div>
            </div>
        )}
        </>
        )
}

export default ProfileModal;