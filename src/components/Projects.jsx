import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase.config"; // Adjust the path according to your setup
import { updateDoc, arrayUnion, doc, where, query, getDocs, collection, getFirestore } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch all projects from Firestore
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

// Fetch bookmarked projects for a specific user
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

// Fetch projects created by a specific user
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
        projects.filter((project) => project.title.toLowerCase().includes(lowerCaseTerm))
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
              <div>
                No projects for this category
                <i className="fa-solid fa-face-frown text-[1.5rem] ml-[0.2rem]"></i>
              </div>
            ) : (
              displayProjects.map((project) => (
                <Card key={project.id} user={user} project={project} />
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

const Card = ({ project, user }) => {
  const handleBookmarkClick = async () => {
    const projectRef = doc(db, "Projects", project.id);
    try {
      await updateDoc(projectRef, {
        bookmarkedBy: arrayUnion(user.uid),
      });
      toast.success("Bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking the project: ", error);
      toast.error("Error bookmarking the project");
    }
  };

  return (
    <div className="w-full cursor-pointer md:w-[430px] h-[355px] rounded-xl p-4 flex flex-col bg-gray-200 items-center gap-4 shadow-lg justify-center border border-gray-300">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} closeOnClick theme="dark" />
      <div className="bg-white w-full h-full overflow-hidden" style={{ height: "100%" }}>
        <iframe
          title="Result"
          srcDoc={project.output}
          style={{ border: "1px solid white", width: "100%", height: "100%" }}
        ></iframe>
      </div>
      <div className="flex items-center justify-start gap-3 w-full text-black bg-gray-100 border-gray-300 shadow-lg border rounded-md">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer">
          {project?.user?.photoURL ? (
            <img src={project.user.photoURL} className="w-[2.2rem] shadow-lg" alt="User" />
          ) : (
            <i className="fa-solid fa-circle-user text-[1.8rem]"></i>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-black text-lg capitalize">{project.title}</p>
          <p className="text-primaryText text-sm capitalize">
            {project?.user?.displayName ? `by ${project.user.displayName}` : project.user.email.split("@")[0]}
          </p>
        </div>
        <i
          className="fa-regular fa-copy hover:bg-gray-300 p-2 rounded-2xl cursor-pointer"
          onClick={() => toast.info("Feature in development :)")}
        ></i>
        <i
          className="fa-solid fa-bookmark hover:bg-gray-300 ml-auto p-2 mr-[1rem] rounded-2xl cursor-pointer"
          onClick={handleBookmarkClick}
        ></i>
      </div>
    </div>
  );
};

export default Projects;
