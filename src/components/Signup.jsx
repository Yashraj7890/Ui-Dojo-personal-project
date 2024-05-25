import React from 'react'
import UserAuth from './UserAuth';
import { useState } from "react";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { auth } from '../firebase/firebase.config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setStatus] = useState(true);

  const createNewUser=async()=>{
   await createUserWithEmailAndPassword(auth,email,password).then((userCred)=>{
    if(userCred){
      toast.success("Account created successfully !");
    }
   }).catch((err)=>{
    toast.error("Error creating user !");
   })
  }

  const loginWihEmailandPassword=async()=>{
  await signInWithEmailAndPassword(auth,email,password).then((userCred)=>{
    if(userCred){
      console.log(userCred);
      toast.success("Logged in successfully !")
    }
  }).catch((err)=>{
    console.log(err);
    toast.error("Error logging in !");
  })
  }

  return (
    <div className='w-full py-6'>
     <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        theme="dark"
      />
      <div className='w-full flex  flex-col items-center justify-center py-8'>
        <p className='mb-[1rem] '>{isLogin?(<div className='text-[1.5rem]'>Log In<i class="fa-solid fa-arrow-right-to-bracket pl-[0.6rem]"></i></div>):(<div className='text-[1.5rem]'>Sign Up<i class="fa-solid fa-user-plus pl-[0.6rem]"></i></div>)}</p>
          <div className='px-8 w-full md:w-auto py-4 rounded-xl bg-secondary border shadow-md flex flex-col items-center justify-center gap-8 border-black'>
         <UserAuth email={email} password={password} setEmail={setEmail} setPassword={setPassword} isLogin={isLogin} setStatus={setStatus} createNewUser={createNewUser} login={loginWihEmailandPassword}></UserAuth>
        </div>
        
       
      </div>
    </div>
  )
}

export default Signup;
