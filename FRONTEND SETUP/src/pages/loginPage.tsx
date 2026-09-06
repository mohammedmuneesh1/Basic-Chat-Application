import { Box, Button, Container, Field, Input, InputGroup, Tabs, Text, VStack } from "@chakra-ui/react";
import {  useState } from "react";
import { PasswordInput } from "../components/ui/password-input";
import { toaster } from "../components/ui/toaster";
import { LOGIN_USER, REGISTER_USER } from "../actions/auth/authApi";
import { useNavigate } from "react-router-dom";



const LoginPage = ()=>{
    return(
        <div className="flex justify-center w-full max-w-full">
        <Container
        centerContent
        // maxW={"100%"}
        maxW={"xl"}
        // className=" mx-auto"
        >

    <Box
     d={'flex'}
     justifyContent={'center'}
     
     p={3}
     bg={"white"}
     w={'100%'}
     m="40px 0 15px 0"  //margin T R B L

     borderRadius={"lg"}
     borderWidth={"1px"}
    >

        <Text
        fontSize={"4xl"}
        font-family={"work sans"}
        color={"black"}
        textAlign={'center'}
        >
      Talk-A-Tive 
        </Text>
    </Box>

    <Box
    bg={"white"}
    w={'100%'}
    p={4}
    borderRadius={"lg"}
    color={"black"}
    borderWidth={"1px"}
    >

   <Tabs.Root
    lazyMount
    unmountOnExit 
    defaultValue="login"
    colorScheme={'green'}
    variant={'plain'}
    className="w-full max-w-full "
   >

<Tabs.List bg="bg.muted" rounded="l3" p="1" w="100%" display="flex">
  <Tabs.Trigger value="login" flex="1" justifyContent="center">
   Login
  </Tabs.Trigger>
  <Tabs.Trigger value="register" flex="1" justifyContent="center">
    Register
  </Tabs.Trigger>
  <Tabs.Indicator rounded="l2" />
</Tabs.List>



      <Tabs.Content value="login">
        <LoginForm/>
      </Tabs.Content>
      <Tabs.Content value="register">
        <SignUp/>
      </Tabs.Content>
    </Tabs.Root>

    </Box>






        </Container>
        </div>

    )
}

export default LoginPage;






//eslint-disable-next-line
const LoginForm = ()=>{


    const [ formData, setFormData ] = useState({email:'',password:''});
    const [loading,setLoading] =useState<boolean>(false);
    const [errorObjData,setErrorObjData] = useState<null | Partial<typeof formData>>(null);
    const navigate = useNavigate();


    const onChangeFn = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }



    const loginAPiFn = async(data = formData)=>{
    setLoading(true);
    const errorObj:Partial<typeof formData> = {};

    if(!data.email.trim()) {
        errorObj.email = 'Email is required';
    }
    if(!data.password.trim()) {
        errorObj.password = 'Password is required';
    }

    if(Object.keys(errorObj).length > 0) {
        setErrorObjData(errorObj);
        setLoading(false);
        return;
    }
    else{
      setErrorObjData(null);
    }

    const res = await LOGIN_USER(data.email,data.password);
    setLoading(false);
    if(res?.success){
             toaster.create({
          title:'Sign in',
          description:'Sign in Successfully',
          type:'success',
        })
        return navigate('/chats');
    }
    else{
        toaster.create({
          title:'Sign in',
          description:res?.response ?? "",
          type:'error',
        });
    }
    
    }




    return(
    <VStack
       spaceY={1}
       paddingTop={6}
        >
            {/*EMAIL START */}
<Field.Root
invalid={!!errorObjData?.email}
>
       <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      Email</Field.Label>

  <Input 
  type="email"
  name="email"
  placeholder="Enter Your Email"
  required
  onChange={onChangeFn}
  value={formData.email}
  p={2}
  />
  <Field.ErrorText>{errorObjData?.email ?? ""}</Field.ErrorText>
</Field.Root>
{/*EMAIL END */}

{/*PASSWORD START */}
<Field.Root
invalid={!!errorObjData?.password}
>
    <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      Password</Field.Label>
    <InputGroup>
  <PasswordInput 
  type="password"
  name="password"
  placeholder="Enter Your Password"
  className="overflow-hidden"
  required
  onChange={onChangeFn}
  p={2}
  value={formData.password}
  />
    </InputGroup>

  <Field.ErrorText>{errorObjData?.password ?? ""}</Field.ErrorText>
</Field.Root>
{/*PASSWORD END */}


{/*SUBMIT BUTTON START */}

<Button
loading={loading}
disabled={loading}
 colorPalette="blue"
  variant="solid"
  width={"full"}
  onClick={()=>loginAPiFn(formData)}
//   className="mt-[25px]"
style={{marginTop:'15px'}}
  >
Sign In
</Button>
{/*SUBMIT BUTTON END */}

{/*GUEST LOGIN START */}
<Button
 colorPalette="orange"
  variant="solid"
  width={"full"}
onClick={() => {
  const guestData = {
    email: 'guest@example.com',
    password: '12345678'
  };

  setFormData(guestData);
  loginAPiFn(guestData); // pass it directly
}}
>
Guest User Credentials
</Button>
{/*SUBMIT BUTTON END */}




        </VStack>
    )

}





const SignUp = ()=>{


      const [loading,setLoading] = useState(false);
      const navigate = useNavigate();
    const [formData,setFormData] = useState<{
        name:string;email:string;password:string;confirmPassword:string;pic:null | File
    }>({
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
        pic:null,
    });

    const [errorInfo,setErrorInfo] = useState<null | Partial<typeof formData>>(null)




    const signUpFn = async ()=>{
      setLoading(true);

      const errorObj:Partial<typeof formData> = {}

      if(formData.name === '') {
        errorObj.name = 'Name is required';
      }
      if(formData.email === '') {
        errorObj.email = 'Email is required';
      }
      if(formData.password === '') {
        errorObj.password = 'Password is required';
      }
      if(formData.confirmPassword === '') {
        errorObj.confirmPassword = 'Confirm Password is required';
      }
      if(formData.password !== formData.confirmPassword) {
        errorObj.confirmPassword = 'Password and Confirm Password do not match';
      }

      if(Object.keys(errorObj).length > 0) {
        toaster.create({
          title:'Sign Up',
          description:'Please fill all the fields',
          type:'error',
        })
         setErrorInfo(errorObj);
         return setLoading(false);
      }
      else{
        setErrorInfo(null);
      }



      const formDataObj = new FormData();

      formDataObj.append('name',formData.name);
      formDataObj.append('email',formData.email);
      formDataObj.append('password',formData.password);
      formDataObj.append('confirmPassword',formData.confirmPassword);
      if(formData.pic !== null){
        formDataObj.append('image',formData.pic);
      }

      const res = await REGISTER_USER(formDataObj);
      setLoading(false)

      if(res?.success){
       toaster.create({
          title:'Sign Up',
          description:'Sign Up Successfully',
          type:'success',
        })
        setFormData({
            name:'',
            email:'',
            password:'',
            confirmPassword:'',
            pic:null,
        })


        return navigate('/chats');
      }
      else{
         return toaster.create({
          title:'Sign Up',
          description:res?.response ?? "",
          type:'error',
        })
      }
    }
    




    const onChangeFn = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData((prevData)=>{
            return{
                ...prevData,
                [e.target.name]:e.target.value
            }
        })
    }









    return(
        <div className=" ">
                <VStack
       spaceY={1}
       paddingTop={6}
       className=""
        >



{/* USERNAME START */}            
  <Field.Root
  invalid={!!errorInfo?.name}
  >
    <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      Username
     </Field.Label>


  <Input 
  type="text"
  name="name"
  placeholder="Enter Your Name"
  p={2}
  onChange={onChangeFn}
  value={formData.name}
  />
  {
    errorInfo && errorInfo.name && (
    <Field.ErrorText 
    fontSize={{ base: 'xs', sm: 'sm' }}
    color="red.500"  
    >
    {errorInfo?.name ?? ""}
    </Field.ErrorText>
    )
  }
{/* <Field.HelperText>Enter Your Full Name</Field.HelperText> */}
  
</Field.Root>
{/* USERNAME END */}            
        {/* name:'',
        email:'',
        password:'',
        confirmPassword:'',
        pic:'', */}

{/*EMAIL START */}
<Field.Root
 invalid={!!errorInfo?.email}
>
        <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      Email</Field.Label>

  <Input 
  type="email"
  name="email"
  placeholder="Enter Your Email"
  required
  onChange={onChangeFn}
  value={formData.email}
  p={2}
  />

    {
    errorInfo && errorInfo.name && (
    <Field.ErrorText 
    fontSize={{ base: 'xs', sm: 'sm' }}
    color="red.500"  
    >
    {errorInfo?.email ?? ""}
    </Field.ErrorText>
    )
  }

</Field.Root>
{/*EMAIL END */}

{/*PASSWORD START */}
<Field.Root
 invalid={!!errorInfo?.password}
>
        <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      Password</Field.Label>
    <InputGroup>
  <PasswordInput 
  type="password"
  name="password"
  placeholder="Enter Your Password"
  className="overflow-hidden"
  required
  onChange={onChangeFn}
  p={2}
  value={formData.password}
  />
    </InputGroup>

      {
    errorInfo && errorInfo.name && (
    <Field.ErrorText 
    fontSize={{ base: 'xs', sm: 'sm' }}
    color="red.500"  
    >
    {errorInfo?.password ?? ""}
    </Field.ErrorText>
    )
  }
</Field.Root>
{/*PASSWORD END */}


{/*CONFIRM PASSWORD START */}
<Field.Root
 invalid={!!errorInfo?.confirmPassword}
>
        <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      Confirm Password</Field.Label>

  
    <PasswordInput 
  type="password"
  name="confirmPassword"
  placeholder="Enter Your Confirm Password"
  required
  p={2}
  className="overflow-hidden"
  onChange={onChangeFn}
  value={formData.confirmPassword}
  />

      {
    errorInfo && errorInfo?.confirmPassword && (
    <Field.ErrorText 
    fontSize={{ base: 'xs', sm: 'sm' }}
    color="red.500"  
    >
    {errorInfo?.confirmPassword ?? ""}
    </Field.ErrorText>
    )
  }
 
</Field.Root>
{/*CONFIRM PASSWORD END */}

{/*INPUT FILE START */}
<Field.Root>
    <Field.Label fontSize={{ base: 'sm', sm: 'md' }} fontWeight="semibold">
      User File</Field.Label>
<Input
type="file"
p={1.5}
className="cursor-pointer"
pointerEvents={"cursor"}
accept="image/*"
onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{

  if(e.target.files?.length === 0) return;


  setFormData((prevData)=>{
      return{
          ...prevData,
          pic:e.target.files![0]
      }
  })  
}}
/>
  {/* <Field.ErrorText>Password is required</Field.ErrorText> */}

</Field.Root>
{/*INPUT FILE END */}

{/*SUBMIT BUTTON START */}

<Button
disabled={loading}
loading={loading}
 colorPalette="blue"
  variant="solid"
  width={"full"}
  onClick={signUpFn}
//   className="mt-[25px]"
style={{marginTop:'15px'}}
  >
Sign Up
</Button>
{/*SUBMIT BUTTON END */}






        </VStack>
        </div>
    )
}