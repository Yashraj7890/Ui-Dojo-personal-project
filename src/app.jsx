import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "./components/Home";
import { auth, db } from "./firebase/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { SET_USER } from "./context/actions/userActions";
import NewProject from "./components/NewProject";


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        setDoc(doc(db, "users", userCred.uid), userCred.providerData[0]).then(
          () => {
            dispatch(SET_USER(userCred.providerData[0]));
            navigate("home/projects", { replace: true });
          }
        );
      } else {
        navigate("/home", { replace: true });
      }
      setInterval(() => {
        setLoading(false);
      }, 2500);
    });
    return () => unsubscribe();
  }, []);


  


  return (
    <>
      {isLoading ? (
        <div className="h-screen w-screen flex flex-row items-center justify-center">
          <div className="">
            <i class="fa-solid fa-circle-notch fa-spin text-4xl text-black"></i>
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex items-start justify-start ">
          <Routes>
            <Route exact path="/home/*" element={<Home />} />
            <Route exact path="/newProject" element={<NewProject />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
