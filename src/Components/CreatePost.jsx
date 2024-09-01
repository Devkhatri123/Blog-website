import React, { useRef } from "react";
import { useState, useEffect } from "react";

import {
  uploadBytes,
  ref as storageRef,
 getDownloadURL,
} from "firebase/storage";
import Nav from "../Components/nav";
import { app, storage } from "../Firebase/firebase";
import "../CSS/nav.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
 addDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import JoditEditor from "jodit-react";
import "react-quill/dist/quill.snow.css";
import {useNavigate} from "react-router-dom"
// import  from "firebase/compat/app";
import { v4 } from "uuid";
const CreatePost = () => {
  const Navigate = useNavigate()
  let auth = getAuth(app);
  let firestore = getFirestore(app);
  let [Error, SetError] = useState();
  let [title, settitle] = useState("");
  let [loading, setloading] = useState(false);
  let [desc, setdesc] = useState("");
  let id = v4();
  let [category, setcategory] = useState("");
  let [file, setfile] = useState(null);
  let [none, setnone] = useState(false);
  const storageRootRef = storageRef(storage);
  let [user, Setuser] = useState(null);
  const [Content, SetContent] = useState("");
  const editor = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        Setuser(user);
        console.log(user);
      } else {
        Setuser(null);
        Navigate("/");
      }
    });
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline"],
      ["link", "image", "video"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "indent",
    "link",
    "image",
    "video",
  ];

  let POST_CATOGIRES = [
    "uncatorizied",
    "Education",
    "Entertermaint",
    "Agriculutre",
    "Sports",
    "Business",
    "Art",
    "Invesment",
    "Weather",
  ];
  
  const createPost = async (e) => {
    SetError("");
    if(!file || !title || !category || !Content){
      return SetError("Please Fill All fields");
    }
    setnone(true);
     setloading(true);
     document.body.style.opacity="0.5";
    try {
      const imgRef = storageRef(storage, `/images/${id}`);
      uploadBytes(imgRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async(url) => {
          try {
          await addDoc(collection(firestore, "blogs"), {
              ID: id,
              title: title,
              description: Content,
              Thumbnail: url,
              category: category,
              userId: user.uid,
              time: firebase.firestore.FieldValue.serverTimestamp(),
            });
            Navigate("/")
          } catch (error) {
            
            console.log("error :", error);
          } finally {
            setloading(false);
            document.body.style.opacity="unset";
          }
        });
      });
      SetError("");
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  return (
    <>
      <>
        <Nav />
          {loading ? (
            <div className="loader"></div>
          ) : null}
          <div className="register">
          <h2>Create Post</h2>
          {Error ? <p id="error">{Error}</p> : null}
          <div className="container">
            <form method="POST" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="name"
                placeholder="Title"
                id="name"
                value={title}
                onChange={(e) => {
                  settitle(e.target.value);
                }}
              />
              {loading  ? <select
                name="category"
                id="select-category"
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
                disabled
              >
                {POST_CATOGIRES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>:<select
                name="category"
                id="select-category"
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
                
              >
                {POST_CATOGIRES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>}
              
              <br />
              <JoditEditor
                ref={editor}
                value={Content}
                onChange={(newContent) => {
                  SetContent(newContent);
                }}
              
              />
              {loading ? <input
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                }}
                
                accept="jpg png jpeg"
                disabled
              />:<input
              type="file"
              name="file"
              id="file"
              onChange={(e) => {
                setfile(e.target.files[0]);
              }}
              
              accept="jpg png jpeg"
            />}
              
              <div className="btn_container">
                {" "}
           {loading ?   <button
                  type="submit"
                  id="btn"
                  onClick={(e) => {
                    createPost();
                  }}
                 disabled>
                  Create Blog
                </button>: <button
                  type="submit"
                  id="btn"
                  onClick={(e) => {
                    createPost();
                  }}
                >
                  Create Blog
                </button>}    
              </div>
            </form>
            {none ? (
              <div>
                <div dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            ) : null}
          </div>
        </div>
      </>
    </>
  );
};

export default CreatePost;
