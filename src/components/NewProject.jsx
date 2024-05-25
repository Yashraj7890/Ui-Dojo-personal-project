import React, { useEffect } from "react";
import Split from "react-split";
import ReactCodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewProject = () => {
  const [html, setHtml] = useState("<div>Hello World !<div/>");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [Title, setTitle] = useState("Untitled project");
  const user = useSelector((state) => state.user?.user);

  const saveProgram = async () => {
    if(user){
      const id = `${Date.now()}`;
      const _doc = {
        id: id,
        title: Title,
        html: html,
        css: css,
        js: js,
        output: output,
        user:user,
        bookmarkedBy:[]
      };
      await setDoc(doc(db, "Projects", id), _doc)
        .then((res) => {
          toast.success("Code saved successfully !");
        })
        .catch((err) => {
          toast.error("Error saving your code !");
          console.log(err);
        });
    }else{
      toast.error("Please Sign in first !")
    }
    
  };

  useEffect(() => {
    UpdateOutput();
  }, [html, css, js]);
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
                    className="bg-[#383838] rounded-lg text-white border-none outline-none p-[5px]"
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </>
              )}
              {!editing && (
                <span className="text-white  text-nowrap pl-[0.3rem]">
                  {Title}{" "}
                </span>
              )}
              {editing && (
                <>
                  <i
                    class="fa-solid fa-check text-[1.2rem] cursor-pointer ml-[0.3rem] p-2 rounded-2xl text-white hover:bg-[#383838] mr-[1rem]"
                    onClick={() => setEditing(false)}
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
                  onClick={saveProgram}
                  className="text-white  bg-purple-700 hover:bg-purple-600  rounded-md px-[0.5rem] py-[0.2rem]"
                >
                  Save
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
            <div className="text-lg text-start mt-[0.635rem] mb-[0.7rem]">
              <span className="bg-gray-200 p-[0.4rem]  border-t-emerald-500 border-t-4">
                Output{" "}
              </span>
            </div>
            <iframe
              title="Result"
              srcDoc={output}
              style={{ border: "none", width: "100%", height: "90%" }}
            ></iframe>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default NewProject;
