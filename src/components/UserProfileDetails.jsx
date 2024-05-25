import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "../helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfileDetails = () => {
  const user = useSelector((state) => state.user?.user);
  const [open, setOpen] = useState(false);
  const [isdown, setDown] = useState(true);

  return (
    <div className="flex items-center justify-end gap-4 relative my-[1rem]">
     <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        theme="light"
      />
      <div className="flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer">
        {user.photoURL && (
          <img src={user.photoURL} className="w-[2.2rem] "></img>
        )}
        {!user.photoURL && <i class="fa-solid fa-circle-user text-[1.8rem]"></i>}
      </div>
      <div
        className=" mr-[1rem] cursor-pointer border border-black rounded-lg bg-white shadow-lg"
        onClick={() => {
          setOpen(!open);
          setDown(!isdown);
        }}
      >
        <i
          className={`fa-solid  ${
            isdown ? "fa-arrow-down" : "fa-arrow-up"
          } text-lg px-[0.5rem] `}
        ></i>
      </div>

      {open && (
        <div className="bg-black absolute top-16 right-0 px-4 py-3 rounded-xl shadow-md z-10 flex flex-col items-start justify-start gap-4 min-w-[150px] text-gray-400">
          
          <div className="text-center w-full hover:text-white cursor-pointer">
            <div className="cursor-pointer" onClick={()=>toast.info("Coming soon :)")} className="px-[2.1rem]">
              Profile
            </div>
          </div>
          <div className="text-center w-full hover:text-white cursor-pointer">
            <button className="w-full" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDetails;
