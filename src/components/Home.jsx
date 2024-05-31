import React, { useState, useEffect } from "react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import Signup from "./Signup";
import Projects from "./Projects";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfileDetails from "./UserProfileDetails";

const Home = () => {
  const user = useSelector((state) => state?.user?.user);
  const [sideMenu, setMenu] = useState(window.innerWidth >= 639);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 639);
  const [type, setType] = useState("All Projects");
  const [term, setTerm] = useState("");
  const handleClick1 = (type) => {
    if (type !== "") {
      setType(type);
    }
    if (window.innerWidth < 639) {
      setMenu(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 639);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <div className="flex min-h-screen max-h-screen w-full">
      <div
        className={`inline ${
          sideMenu ? "w-[17rem]" : "w-[0.2rem]"
        } min-h-screen max-h-screen relative bg-black px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-200 ease-in-out`}
      >
        <div
          onClick={() => setMenu(!sideMenu)}
          className="w-8 h-8 bg-black rounded-3xl absolute -right-4 bottom-[50vh] flex items-center justify-center cursor-pointer"
        >
          {sideMenu ? (
            <HiChevronDoubleLeft className="text-white text-xl py-[0.2rem]" />
          ) : (
            <HiChevronDoubleRight className="text-white text-xl py-[0.2rem]" />
          )}
        </div>

        <div className="overflow-hidden w-full flex flex-col gap-4">
          <Link to={"/home"}>
            <div className="text-white text-[2rem] text-center">Ui-Dojo</div>
          </Link>

          <Link to={"/newProject"}>
            <div
              className="px-2 py-2 flex items-center justify-center text-gray-400 rounded-lg border border-gray-400 cursor-pointer group hover:border-white hover:text-white"
              onClick={() => handleClick1("")}
            >
              <p className=" group-hover:text-gray-200 capitalize">
                <i class="fa-solid fa-plus pr-[0.6rem]"></i>
                New Project
              </p>
            </div>
          </Link>

          {user && (
            <div
              className="flex cursor-pointer items-center justify-center hover:text-white  text-gray-400 px-2 py-2 gap-6 border border-gray-400 hover:border-white rounded-lg"
              onClick={() => handleClick1("Your Projects")}
            >
              <p className=" text-primaryText  ">
                <i class="fa-solid fa-layer-group pr-[0.7rem]"></i>Your Projects
              </p>
            </div>
          )}
          {user && (
            <div
              className="flex cursor-pointer items-center justify-center hover:text-white  text-gray-400 px-2 py-2 gap-6 border border-gray-400 hover:border-white rounded-lg"
              onClick={() => handleClick1("All Projects")}
            >
              <p className=" text-primaryText  ">All Projects</p>
            </div>
          )}
          {user && (
            <div
              className="flex cursor-pointer items-center justify-center hover:text-white  text-gray-400 px-2 py-2 gap-6 border border-gray-400 hover:border-white rounded-lg"
              onClick={() => handleClick1("Bookmarked Projects")}
            >
              <p className=" text-primaryText  ">
                <i class="fa-regular fa-bookmark pr-[0.6rem]"></i> Bookmarked
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex-1 min-h-screen max-h-screen overflow-y-auto h-full flex flex-col items-start justify-start px-4 md:px-12 py-4 md:py-12 bg-gray-100 ${
          isSmallScreen && sideMenu ? "hidden" : "flex"
        }`}
      >
        <div className="w-full">
          <div className="flex items-center w-full gap-2 border border-black rounded-xl bg-white">
            <i className="fa-solid fa-magnifying-glass my-[0.8rem] text-[1.4rem] ml-[0.8rem]" />
            <input
              type="text"
              className="w-[58vw] px-4 text-xl bg-white outline-none border-none text-primaryText placeholder:text-gray-600 my-[0.8rem]"
              placeholder="Search..."
              value={term}
              onChange={(e)=>setTerm(e.target.value)}
            />
          </div>

          {!user &&
            window.location.href == process.env.REACT_APP_URL + "/home" && (
              <div className=" text-right my-[1rem] gap-3 w-full">
                <Link
                  to={"/home/auth"}
                  className="bg-emerald-500 px-3 py-2 rounded-md text-white text-md cursor-pointer hover:bg-emerald-700"
                >
                  Sign Up
                </Link>
              </div>
            )}

          {window.location.href == process.env.REACT_APP_URL + "/home/auth" && (
            <div className=" text-right my-[1rem] gap-3 w-full">
              <Link
                to={"/home"}
                className="bg-emerald-500 px-3 py-2 rounded-md text-white text-md cursor-pointer hover:bg-emerald-700"
              >
                Home
              </Link>
            </div>
          )}

          {window.location.href == process.env.REACT_APP_URL + "/home" && (
            <div className=" h-[60vh] flex flex-col items-center justify-center">
              <div className="text-center text-[1.5rem]">
                Welcome to Ui Dojo{" "}
                <i class="fa-solid fa-brush fa-bounce pl-[0.4rem]"></i>. <br />A
                place to create, edit, fork, experiment and showoff web creations.
              </div>
              <div className="mt-[2rem]">Signup to start with Ui Dojo</div>
              <div className="text-gray-400">
                Features in development : Profile management,
                Lazy Loading, Project deletion {":)"}
              </div>
            </div>
          )}

          {user && <UserProfileDetails user={user}></UserProfileDetails>}
        </div>

        <div className="w-full">
          <Routes>
            <Route
              path="/projects"
              element={<Projects type={type} setType={setType} term={term} setTerm={setTerm}/>}
            />
            <Route path="/auth" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
