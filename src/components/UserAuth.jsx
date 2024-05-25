import React from "react";
import { signInWithGoogle } from "../helper";
const UserAuth = ({
  email,
  password,
  setEmail,
  setPassword,
  isLogin,
  setStatus,
  createNewUser,
  login
}) => {
  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <div>
        <label className="text-sm ">Email</label>
        <div
          className={`flex items-center justify-center gap-3 w-full md:w-96 rounded-md px-4 py-1 `}
        >
          <input
            type="email"
            className="flex-1 w-full h-full py-2 outline-none border rounded-xl border-gray-400 bg-white text-lg px-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>
        <label className="text-sm ">Password</label>
        <div
          className={`flex items-center justify-center gap-3 w-full md:w-96 rounded-md px-4 py-1 `}
        >
          <input
            type="password"
            className="flex-1 w-full h-full py-2 outline-none border rounded-xl border-gray-400 bg-white text-lg px-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>
        {isLogin ? (
          <div className="text-right text-emerald-500 px-[1rem] py-[0.5rem]">
            <div className="cursor-pointer" onClick={() => setStatus(false)}>
              Create an account
            </div>
          </div>
        ) : (
          <div className="text-right text-emerald-500 px-[1rem] py-[0.5rem]">
            <div className="cursor-pointer" onClick={() => setStatus(true)}>
              Have an account ?
            </div>
          </div>
        )}
        {isLogin ? (
          <div className="text-center">
            <button
              onClick={login}
              className="outline-none bg-emerald-500 px-3 py-2 rounded-md text-white text-md cursor-pointer hover:bg-emerald-700 w-[5.5rem] mx-auto mt-[1rem]"
            >
              Log In
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
             
              onClick={createNewUser}
              className="outline-none bg-emerald-500 px-3 py-2 rounded-md text-white text-md cursor-pointer hover:bg-emerald-700 w-[5.5rem] mx-auto mt-[1rem]"
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="text-center mt-[1rem] text-sm text-gray-600">or</div>
        <div className="text-center">
          <button
            onClick={signInWithGoogle}
            type="submit"
            className="outline-none bg-white border border-black px-3 py-2 rounded-md text-black text-md cursor-pointer   mx-auto mt-[1rem]"
          >
            Sign {isLogin ? "in" : "up"} with{" "}
            <i class="fa-brands fa-google"></i>oogle
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
