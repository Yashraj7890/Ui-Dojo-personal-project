import React, { useEffect } from "react";
import Split from "react-split";
import ReactCodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import { useSelector } from "react-redux";
import { doc, setDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const NewProject = () => {
  const [html, setHtml] = useState("<div>Hello World !<div/>");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [Title, setTitle] = useState("Untitled");
  const user = useSelector((state) => state.user?.user);
  const location = useLocation();
  const { variant, project } = location.state || {};
  const [loading,setloading]=useState(false);

  const saveProgram = async (variant) => {
    setloading(true);
    if (user) {
      if (variant == "You are editing your project !") {
        const updatedFields = {
          title: Title,
          html: html,
          css: css,
          js: js,
          output: output,
        };
        await updateDoc(doc(db, "Projects", project.id), updatedFields)
          .then(() => {
            setHtml("");setCss("");setJs("");setTitle("Untitled");
            Swal.fire({
              title:"Project updated successfully!",
              text:"Now you are working on a new project",
              icon:"success"
            })
            
          })
          .catch((err) => {
            Swal.fire({
              title:"Error updating your project!",
              text:err.message,
              icon:"success"
            })
      
          });
      } else {
        const id = `${Date.now()}`;
        const _doc = {
          id: id,
          title: Title,
          html: html,
          css: css,
          js: js,
          output: output,
          user: user,
          bookmarkedBy: [],
        };
        await setDoc(doc(db, "Projects", id), _doc)
          .then((res) => {
            setHtml("");setCss("");setJs("");setTitle("Untitled");
            Swal.fire({
              title:"Project saved successfully!",
              text:"Now you are working on a new project",
              icon:"success"
            })
          })
          .catch((err) => {
            Swal.fire({
              title:"Error saving your code !",
              icon:"error",
              text:err.message
            })
         
          });
      }
    } else {
      Swal.fire({
        title:"Please sign in first !",
        icon:"error",

      })
    }
    setloading(false);
  };

  useEffect(() => {
    UpdateOutput();
  }, [html, css, js]);

  useEffect(() => {
    const copy = () => {
      if (variant && project) {
        toast.success(variant);
        setHtml(project.html);
        setCss(project.css);
        setJs(project.js);
        if (variant == "You are editing your project !") {
          setTitle(project.title);
        }
      }
    };
    copy();
  }, []);

  const UpdateOutput = () => {
    const combinedOutput = `
    <html>
    <head>
    <style>${css}</style>
    </head>
    <body>
    ${html}
    <script>${js}</script>
    </body>
    </html>
    `;
    setOutput(combinedOutput);
  };
  const handleCheck=()=>{
   if(Title.length===0){
    Swal.fire({
      title:"Filename cannot be empty !",
      icon:"error",
    });
   }else{
    setEditing(false)
   }

  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        theme="light"
      />
      <div className="w-full flex items-center justify-between px-12 py-4 bg-black">
        <div className="flex items-center justify-center ">
          <div className="text-white text-nowrap pr-[0.7rem]">Ui Dojo</div>
        </div>
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center justify-center gap-3">
            <>
              {editing && (
                <>
                  <input
                    type="text"
                    placeholder="Project Title"
                    className="bg-[#383838] rounded-lg text-white border-none outline-none p-[5px] w-[6.5rem]"
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </>
              )}
              {!editing && (
                <span className="text-white text-nowrap pl-[0.3rem]">
                  {Title}{" "}
                </span>
              )}
              {editing && (
                <>
                  <i
                    class="fa-solid fa-check text-[1.2rem] cursor-pointer ml-[0.3rem] p-2 rounded-2xl text-white hover:bg-[#383838] mr-[1rem]"
                    onClick={handleCheck}
                  ></i>
                </>
              )}
              {!editing && (
                <i
                  class="fa-regular fa-pen-to-square text-[1.2rem] cursor-pointer ml-[0.3rem] p-2 rounded-2xl text-white hover:bg-[#383838] mr-[0.4rem]"
                  onClick={() => setEditing(true)}
                ></i>
              )}
              {!editing && (
                <button
                  onClick={() => saveProgram(variant)}
                  className="text-white  bg-purple-700 hover:bg-purple-600  rounded-md px-[0.5rem] py-[0.2rem]"
                  disabled={loading}
                >
                {loading?(<i class="fa-solid fa-spinner fa-spin"></i>):"Save"}                  
                </button>
              )}
            </>
          </div>
        </div>
      </div>

      <div className="h-full w-full">
        <Split
          className="w-full h-full"
          direction="vertical"
          size={[60, 60]}
          minSize={80}
          gutterSize={10}
        >
          <div className="w-full min-h-[15rem]">
            <Split className="split h-full  border-y-black border-2 rounded-sm overflow-x-auto ">
              <div className="w-full h-full flex flex-col items-start justify-start min-w-[10rem] overflow-y-auto">
                <div className="w-full flex items-center justify-between">
                  <div className="bg-gray-200 px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-red-500 shadow-sm">
                    <p className="text-center">
                      <i class="fa-brands fa-html5 pr-[0.5rem] text-[1.2rem]"></i>
                      HTML
                    </p>
                  </div>

                  <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                    <i class="fa-solid fa-gear"></i>
                  </div>
                </div>
                <div className="w-[97%] h-full p-2 border rounded-lg bg-sky-100">
                  <ReactCodeMirror
                    value={html}
                    theme={"light"}
                    extensions={[javascript()]}
                    style={{ fontSize: 16 }}
                    onChange={(value) => {
                      setHtml(value);
                    }}
                  />
                </div>
              </div>

              <div className="w-full h-full flex flex-col items-start justify-start min-w-[10rem] overflow-y-auto">
                <div className="w-full flex items-center justify-between">
                  <div className="bg-gray-200 px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-blue-500 shadow-sm">
                    <p className="text-center">
                      <i class="fa-brands fa-css3-alt pr-[0.5rem] text-[1.2rem]"></i>
                      CSS
                    </p>
                  </div>

                  <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                    <i class="fa-solid fa-gear"></i>
                  </div>
                </div>
                <div className="w-[97%] h-full p-2 border rounded-lg  bg-sky-100">
                  <ReactCodeMirror
                    value={css}
                    theme={"light"}
                    extensions={[javascript()]}
                    style={{ fontSize: 16 }}
                    onChange={(value) => {
                      setCss(value);
                    }}
                  />
                </div>
              </div>

              <div className="w-full h-full flex flex-col items-start justify-start min-w-[10rem] overflow-y-auto">
                <div className="w-full flex items-center justify-between">
                  <div className="bg-gray-200 px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-yellow-500 shadow-sm">
                    <p className="text-center">
                      <i class="fa-brands fa-js pr-[0.5rem] text-[1.2rem]"></i>
                      JS
                    </p>
                  </div>

                  <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                    <i class="fa-solid fa-gear"></i>
                  </div>
                </div>
                <div className="w-[97%] h-full p-2 border rounded-lg  bg-sky-100">
                  <ReactCodeMirror
                    value={js}
                    theme={"light"}
                    extensions={[javascript()]}
                    style={{ fontSize: 16 }}
                    onChange={(value) => {
                      setJs(value);
                    }}
                  />
                </div>
              </div>
            </Split>
          </div>
          <div className="w-full h-full overflow-y-auto overflow-x-auto">
            
            <iframe
              title="Result"
              srcDoc={output}
              style={{ border: "none", width: "100%", height: "100%",overflow:"hidden"}}
            ></iframe>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default NewProject;
