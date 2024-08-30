import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import JoditEditor from 'jodit-react';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { useRef } from 'react';
import { app,storage } from '../Firebase/firebase';
import {uploadBytes,ref as storageRef, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
import {toast} from "react-hot-toast"
import "../CSS/CreatePost.css";
const Edit = () => {
  let params = useParams();
  let navigate = useNavigate();
  let [user,Setuser] = useState(null);
  let [blog, setBlog] = useState(null);
  let [title, settitle] = useState("");
  let [category,setcategory] = useState("");
  let [none,setnone] = useState(false);
  let [loading,setloading] = useState(false);
  const [Content,SetContent] = useState('');
  const editor = useRef(null);
  let [file, setfile] = useState(null);
  let [Error, SetError] = useState();
  let id = v4();
  let auth = getAuth(app);

 useEffect(()=>{
  onAuthStateChanged(auth,(user)=>{
    if(user){
      Setuser(user);
      console.log(user);
    }else{
      Setuser(null);
    }
  })
},[]);

  const getBlogInfo = async () => {
    try {
      firebase
        .firestore()
        .collection("blogs")
        .doc(params.id)
        .get()
        .then((res) => {
          if (res.exists) {
            let data = res.data();
            console.log("Data from Firestore:", data);
            setBlog(data);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(()=>{
  getBlogInfo();
  },[])

 
  const EditPost = async (e)=>{
    if(!file){
      SetError("Please Select Thumbnail");
      return;
    }
    setnone(true);
    setloading(true);
      try{
       const imgRef = storageRef(storage,`/images/${id}`);
             uploadBytes(imgRef,file).then((snapshot)=>{
             getDownloadURL(snapshot.ref).then((url)=>{
              try{
                firebase.firestore().collection("blogs").doc(params.id).update({
                  ID:id,
                 title:title||blog.title,
                 description:Content||blog.description,
                 Thumbnail:url||blog.Thumbnail,
                 category:category||blog.category,
                 userId: user.uid,  
                 time:firebase.firestore.FieldValue.serverTimestamp(),  
                }).then(()=>{
                  toast.success("Document updated successfully");
                }).catch((error)=>{
                  toast.error(error);
                })
          
              setloading(false)
              navigate("/blogs");
            }catch (error){
             setloading(false)
              console.log("error :",error);
            }
             })
             })
             SetError("")
     }catch (error){
       setloading(false);
       console.log(error)
       }
     };
     
  let POST_CATOGIRES = ["uncatorizied","Education","Entertermaint","Agriculutre","Sports","Business","Art","Invesment","Weather"];
  return (
    <div>
      {loading ? (
      <div class="spinner">
      <div class="dot"></div>
    </div>
      ) : null}

    <div className="edit">
    <form method="POST" onSubmit={(e) => e.preventDefault()}>
    <h1>Edit Blog</h1>
    {Error ? <p id="error">{Error}</p> : null}
      <input
        type="text"
        name="name"
        placeholder="Title"
        id="name"
        value={blog?.title||title}
        onChange={(e)=>settitle(e.target.value,blog.title="")}
      />
      <select name="category" id="select-category" value={blog?.category||category} onChange={(e)=>setcategory(e.target.value,blog.category="")}>
         {POST_CATOGIRES.map(cat=> <option key={cat}>{cat}</option>)}
      </select>
    <br />
     <JoditEditor
     ref={editor}
     value={blog?.description|| Content}
     onChange={(newContent)=>SetContent(newContent,blog.description="")}
     />
   <input type="file" name="file" id="file" onChange={(e)=>{setfile(e.target.files[0])}} accept="jpg png jpeg"/>
      <div className="btn_container">  <button type="submit" id="btn" onClick={(e) => {EditPost();}}>
        Edit Blog</button></div>
    </form>
    </div>
    </div>

  )
}

export default Edit
