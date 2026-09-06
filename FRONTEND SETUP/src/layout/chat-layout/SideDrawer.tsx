import { Avatar, Box, Button, Drawer, Input, Menu,  Portal, Text,  } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Tooltip } from "../../components/ui/tooltip"; 
import { MdClose, MdSearch } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ProfileModal from "../../components/custom/ProfileModal";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import axiosInstance from "../../configure/axios/axiosInstance";
import ChatLoading from "../../components/custom/ChatLoading";
import UserListItem from "./UserListItem";
import { LOGOUT_USER_FN } from "../../actions/auth/authApi";
import { useSocket } from "../../context/SocketContext";


const SideDrawer = ()=>{


    const [bounceSearchText,setBounceSearchText] = useState('');
    const [searchTxt,setSearchTxt] = useState('');
    const {notification} = useSocket();
    const [searchResult,setSearchResult ] = useState([]);
    const [loading,setLoading] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();



    useEffect(()=>{

  if (bounceSearchText?.length) {
    setLoading(true);
  }

     const handler = setTimeout(() => {
     setSearchTxt(bounceSearchText); // update after delay
  }, 500);


  return ()=>{
    clearTimeout(handler)
  }


    },[bounceSearchText]);



    useEffect(()=>{
        if(searchTxt){
            handleSearch();
        }
    },[searchTxt])




    const logoutHandlerFn =async()=>{
        const isUserConfirmed = await Swal.fire({
             title:'Logout?',
             text:'Are you sure you want to logout?',
             icon:'warning',
             showCancelButton:true,
             confirmButtonColor:'#3085d6',
             cancelButtonColor:'#d33',
             confirmButtonText:'Logout',
             showConfirmButton:true
        });
        if(isUserConfirmed.isConfirmed){
            const res = await LOGOUT_USER_FN();
            if(res?.success){
              return navigate('/login');
            }
            else{
                return Swal.fire({
                    title:'Error',
                    text:'Something went wrong',
                    icon:'error',
                    showConfirmButton:true,
                });
            }
        }
        return;
    }



    const handleSearch =async ()=>{
        if(!searchTxt){
            setLoading(false);
           return  setSearchResult([]);
        }
        else{
            try {
                setLoading(true);
                // /search/profile
              const res = await axiosInstance.get(`/api/users/search/profile?search=${searchTxt}`);
              setLoading(false);
              console.log('res',res);
              if(res?.data?.success){
                setSearchResult(res?.data?.data?.data ?? []);
              }
              else{
               return Swal.fire({
                   title:'Error',
                   text:'Something went wrong',
                   icon:'error',
                   showConfirmButton:true,
               });
              }
        } 
        //eslint-disable-next-line
        catch (error) {
            setLoading(false);
        }
}
    }



    return(
        <Box
        display="flex"
        justifyContent={'space-between'}
        alignItems={'center'} //vertical manner center
        bg='white'
        w={`100%`}
        p={'9px 10px'}
        borderWidth={'5px'}
        height={'80px'}

        // borderStyle={'solid'}
        borderColor={'blackAlpha.200'}
        // borderRadius={'lg'}
        >

            {/*THE SEARCH USER BUTTON START */}
            <Tooltip
            content="Search User to chat"
            aria-label="Search User to chat"

            >

        <span
        className="flex bg-black !items-center justify-center gap-2 !p-1 rounded-md"
         
        // px={4}
        >
            <MdSearch className="!text-white" />
        <Button 
        size="sm"
        onClick={()=>setIsDrawerOpen(true)}
        >
            <Text d={{base:'none',md:"flex"}}
            >
                Search User
            </Text>
        </Button>
                      

        </span>
            </Tooltip>

{/*THE SEARCH USER BUTTON END */}



{/* THE APP NAME START */}
        <Text
        fontSize={'2xl'}
        fontFamily={'Work sans'}
        >
            PulseChat
        </Text>
{/* THE APP NAME END */}


{/*THE MENU SECTION START */}

<div className="flex gap-x-2">




{/*NOTIFICATION MENU START */}
    <Menu.Root>
          <Menu.Trigger asChild>
        <Button  variant={'outline'} size={'sm'}>
            <FaBell />
        </Button>
    </Menu.Trigger>

  <Menu.Positioner>
          <Menu.Content
           py={4}
           px={6}
           gap={'6px'}
           spaceY={5}
           fontSize={{ base: "md", md: "lg" }}
           
          >
                        <Menu.Item
            fontSize={{ base: "md", md: "lg" }}
            value="new-txt">
             <>
              {notification.length > 0 ?(
              notification.map((val)=>(
                <>
                <Text>
                  {val?.message}
                </Text>
                </>
              ))
            ):(
              <>
  no notification not found.
              </>
            ) }
            </>
              </Menu.Item>
          </Menu.Content>
</Menu.Positioner>
    </Menu.Root>

{/*NOTIFICATION MENU END */}



{/*USER PROFILE START */}

<Menu.Root>
    <Menu.Trigger asChild >
        <Button 
        variant={'outline'}
        overflow={'hidden'}
        size={'sm'}
        >
         {/*AVATAR ROOT START */}   
          <Avatar.Root>
      <Avatar.Fallback name="Segun Adebayo" />
      <Avatar.Image src="https://bit.ly/sage-adebayo" />
    </Avatar.Root>
    {/*AVATAR ROOT END */}   
    <IoIosArrowDown/>
        </Button>
    </Menu.Trigger>

  <Menu.Positioner
  borderBottom={'100px'}
  borderBottomColor={'red'}
  >
          <Menu.Content
           gap={'6px'}
    borderBottomWidth="2px"
  borderBottomColor="gray.200"
  
          >
            <Menu.Item
            fontSize={{ base: "md", md: "lg" }}
            py={4}
            px={10}
            value="new-txt"
            cursor={'pointer'}
            >

                <>


        <ProfileModal
                isOpen={openModal}
                closeModal={()=>setOpenModal(false)}
             handleModal={(val:boolean)=>setOpenModal(val)}
                user={null}
                >
                    <Text
                     fontSize={{ base: "md", md: "lg" }}
                     border={'none'}
                     >
                      My Profile 
                    </Text>

                </ProfileModal>


            </>
                </Menu.Item>

            <Menu.Item
            fontSize={{ base: "md", md: "lg" }}
            value="open-file"
             py={4}
             px={10}
             cursor={'pointer'}
            >

                <Text
                onClick={logoutHandlerFn}
                >
              Logout
                </Text>
            </Menu.Item>
            
          </Menu.Content>
        </Menu.Positioner>

</Menu.Root>
{/*USER PROFILE END */}

</div>
{/*THE MENU SECTION END */}




{/*DRAWER START */}

   <Drawer.Root
   placement={'start'}
   size={'md'}
    open={isDrawerOpen} 
    onOpenChange={(e) => setIsDrawerOpen(e.open)}
   >
      
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
          px={4}
          >
            <Drawer.Header
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={3}
            >
              <Drawer.Title>Drawer Title</Drawer.Title>
          <Drawer.CloseTrigger display="inline-flex">
                <MdClose
                className="!text-lg sm:text-2xl !cursor-pointer"
              /></Drawer.CloseTrigger>
            </Drawer.Header>
            
            <Drawer.Body
            mt={5}
            >

                {/*SEARCH BOX START */}
                <Box
                display={'flex'}
                pb={'2'}
                gap={2}
                >

                    <Input
                    placeholder="Search by name or email"
                    // variant={'filled'}
                    value={ bounceSearchText}
                    onChange={(e)=>setBounceSearchText(e.target.value)}
                    size={'sm'}
                    py={3}
                    px={3}
                    />

                    {/* <Button
                    size={'sm'}
                    py={3}
                    onClick={handleSearch}
                    >
                      Go
                    </Button> */}


                </Box>

            {/*SEARCH BOX END */}



            {/*SEARCH RESULT START */}

            {
                loading ?(
                    <ChatLoading/>
                ):(
                    searchTxt &&
                     searchTxt?.length > 0 &&
                      searchResult?.length === 0 ?(
                        <>
                        <Text 
                          fontSize={{ base: "md", md: "lg" }}
                        >
                            No user found
                        </Text>
                        </>
                    ):(
                      <div className="flex flex-col !space-y-4 !pt-4">
                        {searchResult && 
                        searchResult?.map(
                          //eslint-disable-next-line
                          (val:any)=>(
                            <UserListItem
                            customFn={()=>setIsDrawerOpen(false)}
                            key={val?._id}
                            data={val}
                            isUnderline
                            />
                        ))}
                      </div>
                    )
                )
            }
            
            {/*SEARCH RESULT END */}




          
            </Drawer.Body>
            
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>

{/*DRAWER END */}


        </Box>
    )
}


export default SideDrawer;