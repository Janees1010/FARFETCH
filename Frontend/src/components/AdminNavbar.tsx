import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { useState,useEffect } from "react";
import { useAppSelector} from "../redux/slices/userSlicer";
import axios,{AxiosResponse} from 'axios';
import {useAppDispatch,addUser } from "../redux/slices/userSlicer";

const AdminNavbar = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useAppSelector((state) => state.userDetails);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const logout = () => {
    console.log("logout function");
    axios
      .get("http://localhost:3000/logout", { withCredentials: true })
      .then((res) => {
        if (res) {
          navigate("/signin");
          window.history.pushState(null, "", window.location.href);
          window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const response:AxiosResponse = await axios.get("http://localhost:3000/refreshtoken", { withCredentials: true });
        response ? dispatch(addUser(response.data)) : ""
        if (response.data.role !== "admin") {
          navigate("/"); // Redirect if not admin
        }
      } catch (error) {
        console.log(error);
        navigate("/signin"); // Redirect to sign-in on error
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };
    loadUserRole();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Optionally, a loading spinner or skeleton can be shown here
  }

  return (
    <>
       {}
    <div className="flex py-2 px-8 justify-between h-[60px] items-center bg-slate-800 ">
      <div className="flex gap-[40px] sm:gap-[100px] ">
        <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
        <div className="flex gap-5 text-gray-400 font-medium">
          <Link to="">Users</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="">Chart</Link>
          <Link to="">Products</Link>
        </div>
      </div>

      <div>
        <div className="flex flex-col">
          <IoPerson
            onClick={() => setShowDropdown((preval) => !preval)}
            className="text-xl text-white"
          />
        </div>
      </div>
    </div>
      {showDropdown ? (
        <div className="z-50 shadow-lg bg-white text-gray-500 font-medium   px-6 py-3 rounded-md flex absolute gap-2 right-[20px] sm:right-[25px] top-[65px] sm:top-[65px] flex-col pt-3">
          {user.username ? (
            <>
              <p>{user.username}</p>
              <div className="w-full bg-black h-[1px]"></div>
              <Link onClick={logout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/signup">Signup</Link>
              <div className="w-full bg-black h-[1px]"></div>
              <Link to="/signin">Signin</Link> 
            </>
          )}
        </div>
      
      ) : (
        ""
      )}

      <Outlet />
 </> 
  );
};

export default AdminNavbar;
