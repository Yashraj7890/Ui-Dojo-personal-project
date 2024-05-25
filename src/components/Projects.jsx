import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase.config";
import {
  updateDoc,
  arrayUnion,
  doc,
  where,
  query,
  getDocs,
  collection,
  getFirestore,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";


const getAllProjects = async () => {
  const db = getFirestore();
  const projectsRef = collection(db, "Projects");
  try {
    const querySnapshot = await getDocs(projectsRef);
    const allProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return allProjects;
  } catch (error) {
    console.error("Error fetching all projects: ", error);
    return [];
  }
};

const getBookmarkedProjects = async (uid) => {
  const db = getFirestore();
  const projectsRef = collection(db, "Projects");
  if (!uid) {
    console.error("No user UID provided");
    return [];
  }
  try {
    const q = query(projectsRef, where("bookmarkedBy", "array-contains", uid));
    const querySnapshot = await getDocs(q);
    const bookmarkedProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bookmarkedProjects;
  } catch (error) {
    console.error("Error fetching bookmarked projects: ", error);
    return [];
  }
};

export const getUserProjects = async (uid) => {
  const db = getFirestore();
  const projectsRef = collection(db, "Projects");
  try {
    const q = query(projectsRef, where("user.uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const userProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return userProjects;
  } catch (error) {
    console.error("Error fetching user projects: ", error);
    return [];
  }
};

const Projects = ({ type, term, setTerm }) => {
  const user = useSelector((state) => state.user?.user);
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setFetching(true);
      try {
        let fetchedProjects = [];
        if (type === "All Projects") {
          fetchedProjects = await getAllProjects();
        } else if (type === "Bookmarked Projects") {
          fetchedProjects = await getBookmarkedProjects(user.uid);
        } else if (type === "Your Projects") {
          fetchedProjects = await getUserProjects(user.uid);
        }
        setProjects(fetchedProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    fetchProjects();
  }, [type, user]);

  useEffect(() => {
    if (term.length > 0 && projects.length > 0) {
      const lowerCaseTerm = term.toLowerCase();
      setFiltered(
        projects.filter((project) =>
          project.title.toLowerCase().includes(lowerCaseTerm)
        )
      );
    } else {
      setFiltered([]);
      setTerm("");
    }
  }, [term, projects, setTerm]);

  const displayProjects = filtered.length > 0 ? filtered : projects;

  return (
    <>
      <div className="text-[1.2rem] pl-[1.4rem] font-bold">{type}</div>
      <div className="w-full py-6 flex items-center justify-center gap-6 flex-wrap">
        {fetching ? (
          <i className="fa-solid fa-spinner fa-spin text-[2rem]"></i>
        ) : (
          <>
            {displayProjects.length === 0 ? (
              <div>No projects for this category {":("}</div>
            ) : (
              displayProjects.map((project) => (
                <Card
                  key={project.id}
                  user={user}
                  project={project}
                  type={type}
                />
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

const Card = ({ project, user, type }) => {
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleBookmarkClick = async () => {
    setLoading(true);
    const projectRef = doc(db, "Projects", project.id);
    try {
      await updateDoc(projectRef, {
        bookmarkedBy: arrayUnion(user.uid),
      });
      Swal.fire({
        title: "Bookmarked successfully !",
        icon: "info",
      });
    } catch (error) {
      Swal.fire({
        title: "Error bookmarking the project !",
        text: error.message,
        icon: "info",
      });
    }
    setLoading(false);
  };

  const handleCopyClick = async (variant) => {
    setLoading(true);
    navigate('/newProject', { state: { variant,project  } });
    setLoading(false);
  };




  return (
    <div className="w-full cursor-pointer md:w-[430px] h-[355px] rounded-xl p-4 flex flex-col bg-gray-200 items-center gap-4 shadow-lg justify-center border border-gray-300">
      <div
        className="bg-white w-full h-full overflow-hidden"
        style={{ height: "100%" }}
      >
        <iframe
          title="Result"
          srcDoc={project.output}
          style={{ border: "1px solid white", width: "100%", height: "100%" }}
        ></iframe>
      </div>
      <div className="flex items-center justify-start gap-3 w-full text-black bg-gray-100 border-gray-300 shadow-lg border rounded-md">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer">
          {project?.user?.photoURL ? (
            <img
              src={project.user.photoURL}
              className="w-[2.2rem] shadow-lg"
              alt="User"
            />
          ) : (
            <i className="fa-solid fa-circle-user text-[1.8rem]"></i>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-black text-lg ">{project.title}</p>
          <p className="text-primaryText text-sm capitalize">
            {project?.user?.displayName
              ? `by ${project.user.displayName}`
              : project.user.email.split("@")[0]}
          </p>
        </div>

      
        {project.user.uid!==user.uid ? (
          loading ? (
            <i className="text-[1.2rem] fa-solid fa-spinner fa-spin p-2 ml-[auto] rounded-2xl cursor-pointer"></i>
          ) : (
            <i
              className="text-[1.2rem] fa-solid fa-code-fork hover:bg-gray-300 p-2 ml-[auto] rounded-2xl cursor-pointer"
              onClick={()=>handleCopyClick("Forked a project !")}
            ></i>
          )
        ) : (
          <></>
        )}

        {project.user.uid===user.uid ? (
          loading ? (
            <i className="text-[1.2rem] fa-solid fa-spinner fa-spin p-2 ml-[auto] rounded-2xl cursor-pointer"></i>
          ) : (
            <i
              className="text-[1.2rem] fa-solid fa-pen-to-square hover:bg-gray-300 p-2 ml-[auto] rounded-2xl cursor-pointer"
              onClick={()=>handleCopyClick("You are editing your project !")}
            ></i>
          )
        ) : (
          <></>
        )}

        {loading ? (
          <i class="text-[1.2rem] fa-solid fa-spinner fa-spin p-2 ml-[auto] rounded-2xl cursor-pointer"></i>
        ) : (
          <i
            className=" text-[1.2rem] fa-solid fa-bookmark hover:bg-gray-300 ml-auto p-2 mr-[1rem] rounded-2xl cursor-pointer"
            onClick={handleBookmarkClick}
          ></i>
        )}

      </div>
    </div>
  );
};

export default Projects;
