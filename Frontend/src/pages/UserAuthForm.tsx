import {useEffect, useState } from "react";
import {toast,Toaster} from "react-hot-toast"
import  {Link, useNavigate, useParams} from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import "../App.css"
import axios from "axios";
import { useAppDispatch } from "../redux/slices/userSlicer";
import { addUser } from "../redux/slices/userSlicer";
import { FcGoogle } from "react-icons/fc";
import ClipLoader from 'react-spinners/ClipLoader'; // Example spinner
import { useAppSelector } from "../redux/slices/userSlicer";
import useLoadUserData  from "../hooks/useLoadUserData";

interface Props {
  type: string;
}


const UserAuthForm = ({ type }: Props) => {
  
  const dispatch = useAppDispatch()
  const {loadUserData} = useLoadUserData()
  const navigate = useNavigate()



  const [loading,setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  

  // Handle input change and update the state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submit with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
    if (type === "signup" && !username) {
      toast.error("Username is required for signin!");
      return;
    }
    if (!email || !emailRegex.test(email) ) {
      toast.error("Email is required and must be valid!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
     axios.defaults.withCredentials = true;
    if(type === "signin"){
         console.log(formData);
        axios.post("http://localhost:3000/signin",{...formData}).then((resp)=>{
           const payload = resp.data.user
           dispatch(addUser(payload))
           if(payload.role === "admin"){
              navigate("/admin")
           }else{
              navigate("/")
           }
        }).catch((err) => { 
          console.log(err,"login failed")
          toast.error("email or password is incorrect")
        })
    }else{
        axios.post("http://localhost:3000/signup",{...formData}).then((resp)=>{
          const payload = resp.data.user
          console.log("payload")
          dispatch(addUser(payload))
          navigate("/") 
        }).catch(err => console.log(err))
    }
    // toast.success("Form submitted successfully!");
  };
  const googleAuth = ()=>{
    console.log("clicked");
    window.open("http://localhost:3000/auth/google/callback","_self")
  }
  // const user = useAppSelector((state)=> state.userDetails)

  useEffect(() => {
     loadUserData().then((user)=>{
        console.log("hello",user);
        if(user.token){
           setLoading(false)
           navigate("/")
        }else{
           setLoading(false)
        }
        
     }).catch((err)=>setLoading(false))
  }, []); 
  
  
  
   if(loading){
    return <div className="spinner-container flex justify-center items-center h-screen">
               <ClipLoader color="#3498db" size={50} /> {/* Customize spinner */}
            </div>
   }
  return (
    <div className="h-screen flex items-center justify-center">
      <Toaster />
      <form
        className="shadow-lg flex flex-col justify-center rounded-md  items-center gap-[25px] border-r-2 min-w-[250px] w-[80%]  sm:max-w-[500px] min-h-[500px] p-3"
        onSubmit={handleSubmit}
      >
        {type === "signin" ? (
          <h1 className="text-center text-2xl font-bold md:text-3xl  pb-7">Signin to your account</h1>
        ) : (
          <h1 className="text-center text-3xl font-bold md:text-3xl pb-2">Create a new account</h1>
        )}

        {type === "signup" && (
          <input
            type="text"
            className="input sm:max-w-[350px] min-w-[200px] w-[80%]"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        )}

        <input
           className="input sm:max-w-[350px] min-w-[200px] w-[80%]"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
           className="input sm:max-w-[350px] min-w-[200px] w-[80%]"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className=" sm:py-3 py-2 btn text-center bg-blue-500" type="submit">
          Submit
        </button>

        <div className="flex items-center">
          <hr className="w-10 sm:w-[72px] border-gray-300" />
           <p className="px-4">Or continue with</p>
          <hr className="w-10 sm:w-[72px] border-gray-300" />
        </div>

        <div className="w-full flex items-center justify-center gap-[20px] relative">
           <button type="button" onClick={googleAuth} className="relative w-[80%] min-w-[200px] bg-black border-btn text-lg text-white font-semibold flex items-center justify-center gap-2 p-2">
             <FcGoogle className="text-2xl" />
                 Google
          </button>
       </div>

        <div>
          {
            type == "signup" ? <p>Already a user ? <Link className="text-blue-500 underline" to="/signin" >Signin</Link></p>
            :<p>Create a new account ? <Link className="text-blue-500 underline" to="/signup" >Signup</Link></p>
          }
          
        </div>

      </form>
    </div>
  );
};

export default UserAuthForm;

