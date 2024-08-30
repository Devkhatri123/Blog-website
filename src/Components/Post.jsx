import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import { app } from "../Firebase/firebase";
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import Nav from "../Components/nav";
import "../CSS/Post.css";
const Post = () => {
  let params = useParams();
  const Ref = useRef(null);
  let navigate = useNavigate();
  let auth = getAuth(app);
  const [user,Setuser] = useState(null);
  let [blog, setBlog] = useState(null); // Initialize blog state with null
  console.log(params.id);
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
  useEffect(() => {
    getBlogInfo();
    
  }, []);

  let DeleteBlog = (id) => {
    firebase.firestore().collection("blogs").doc(id).delete().then(()=>{
      console.log("Blog deleted successfully");
      navigate("/");
    }).catch((error)=>{
      console.log(error);
    })
   }

  return (
    <div>
      <Nav />
      <div id="blog">
        {blog ? (
          <div>
            <div className="heading">
              <h1>{blog.title}</h1>
            </div>
            <div className="author_name_publish_date" style={user && user.uid === blog.userId ?{justifyContent:"space-between",alignItems:"center"}:null}>
              <h4 id="Category">{blog.category}</h4>
              <div>
              {user && user.uid === blog.userId ? <button className="Edit_btn" onClick={()=>navigate(`/edit/${params.id}`)}>Edit</button> :null}
             {user && user.uid === blog.userId ? <button className="delete_button" onClick={()=>DeleteBlog(params.id)}>Delete</button> :null}
              </div>
            </div>
            <div className="thumbnail">
              <img src={blog.Thumbnail} alt={blog.title} id="Thumbnail"  style={{height:"250px",objectFit:"fill"}}/>
            </div>
            <div className="content">
              <div dangerouslySetInnerHTML={{ __html:blog.description }}  ref={Ref}/>
            </div>
          </div>
        ) : (
          <p>No blog data</p>
        )}
      </div>
    </div>
  );
};
export default Post