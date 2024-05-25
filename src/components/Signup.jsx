import React from "react";
import UserAuth from "./UserAuth";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const createNewUser = async () => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        if (userCred) {
          Swal.fire({
            title: "Account created successfully !",
            icon: "success"
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error creating account !",
          text:err.message,
          icon: "error"
        });
      });
    setLoading(false);
  };

  const loginWihEmailandPassword = async () => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        if (userCred) {
          Swal.fire({
            title: "Logged in successfully !",
            icon: "success"
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error logging in !",
          text:err.message,
          icon: "error"
        });
      });
    setLoading(false);
  };

  return (
    <div className="w-full py-6">
      <div className="w-full flex  flex-col items-center justify-center py-8">
        <p className="mb-[1rem] ">
          {isLogin ? (
            <div className="text-[1.5rem]">
              Log In
              <i class="fa-solid fa-arrow-right-to-bracket pl-[0.6rem]"></i>
            </div>
          ) : (
            <div className="text-[1.5rem]">
              Sign Up<i class="fa-solid fa-user-plus pl-[0.6rem]"></i>
            </div>
          )}
        </p>
        <div className="px-8 w-full md:w-auto py-4 rounded-xl bg-secondary border shadow-md flex flex-col items-center justify-center gap-8 border-black">
          <UserAuth
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            isLogin={isLogin}
            setStatus={setStatus}
            createNewUser={createNewUser}
            login={loginWihEmailandPassword}
            loading={loading}
          ></UserAuth>
        </div>
      </div>
    </div>
  );
};

export default Signup;
