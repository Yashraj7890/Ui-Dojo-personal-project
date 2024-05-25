import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import {auth} from "../firebase/firebase.config"
import "react-toastify/dist/ReactToastify.css";
const UserProfileDetails = () => {

  const [open, setOpen] = useState(false);
  const [isdown, setDown] = useState(true);

  const signOut=async()=>{
    
    await auth.signOut().then(()=>{
      Swal.fire({
        text:"Signed out !",
        icon: "info"
      });
        window.location.reload();
    })
}


    return (
      <div className="flex items-center justify-end gap-4 relative my-[1rem]">
        <div className="flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer">
          <i class="fa-solid fa-circle-user text-[1.8rem]"></i>
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
          <div className="bg-black absolute top-10 right-0 px-4 py-3 rounded-xl shadow-md z-10 flex flex-col items-start justify-start gap-4 min-w-[150px] text-gray-400">
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
