import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/slices/userSlicer";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
// import { FaRegHeart } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import {  useEffect, useState } from "react";
import useLoadUserData from "../hooks/useLoadUserData";
import axios from "axios";

const Navbar = () => {
    // const dispatch = useAppDispatch();
    const {loadUserData} = useLoadUserData();
    const user = useAppSelector((state) => state.userDetails);
    const [showDropdown,setShowDropdown] = useState<boolean>(false)
    const navigate = useNavigate()

    //  const loadUserData = useCallback(() => {
    //         axios.get("http://localhost:3000/refreshtoken",{ withCredentials: true })
    //             .then((res) => {   
    //                dispatch(addUser(res.data)); 
    //             })
    //             .catch((err) => {
    //                 // navigate("/signin")
    //                 console.log(err.message)
    //             });
    // }, [user.token]);

    useEffect(() => {
            console.log(loadUserData);
            loadUserData(); 
    }, []);

    const logout = ()=>{
       console.log("logout function");
       axios.get("http://localhost:3000/logout",{withCredentials:true}).then((res)=>{
            if(res){
                navigate("/signin")
                window.history.pushState(null, "", window.location.href);
                window.onpopstate = function () {
                window.history.pushState(null, "", window.location.href);
              }
    };
       }).catch((err)=>{
           console.log(err);
       })
    } 
    

    return (
        <div>
            <nav className="items-center flex py-2 px-6 justify-between">
                <div className="hidden sm:flex gap-4 w-[100px]">
                    <Link to="/products/Womens" className="text-gray-600">Women</Link>
                    <Link to="/products/Mens" className="text-gray-600">Men</Link>
                    <Link to="/products/Kids" className="text-gray-600">Kids</Link>
                </div>
                <div>
                    <Link to="/" className="text-3xl font-bold">FARFETCH</Link>
                </div>
                <div className="flex gap-4 w-[100px] ">
                    <div className="flex flex-col">
                      <IoPerson onClick={(()=> setShowDropdown((preval) => !preval ))} className="text-xl text-gray-600" />
                    </div>
                    {/* <div>
                    <FaRegHeart className="text-xl text-gray-600" />
                    </div> */}
                    <Link to={`/cart`}>
                        <MdOutlineShoppingCart className="text-xl text-gray-600" />
                    </Link>
                </div>
            </nav>
                {
                    showDropdown ?    <div className="shadow-lg bg-white text-gray-500 font-medium mt-3 z-50   px-6 py-3 rounded-md flex absolute gap-2 right-[25px] sm:right-[35px] top-[35px] sm:top-[45px] flex-col pt-3">
                     
                     {
                        user.username ?<div className="flex flex-col gap-2 px-3 items-start ">
                         <h3 className="text-md font-medium">{user.username}</h3>
                         <Link onClick={() => setShowDropdown((prev:boolean)=>!prev)} to={`/orders/${user._id}`}>Orders</Link>
                        <div className="w-full bg-black h-[1px]"></div>
                         <Link onClick={logout}>Logout</Link>
                      </div> : 
                        <> 
                        <Link to={`/signup`}>Signup</Link>
                        <div className="w-full bg-black h-[1px]"></div>
                        <Link to="/signin" >Signin</Link>
                        </>
                     }
                    
                  </div> : ""
                }
                  
            <Outlet />
        </div>
    );
};

export default Navbar;
