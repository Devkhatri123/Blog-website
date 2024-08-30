import React, { useState,useEffect } from 'react'
import Nav from './nav'
import { collection,getFirestore, onSnapshot} from 'firebase/firestore';
import {useNavigate} from "react-router-dom"
import { app } from '../Firebase/firebase';
import { Link } from 'react-router-dom';
import "../CSS/Blogs.css"
import { getAuth,onAuthStateChanged } from 'firebase/auth';
const Blogs = () => {
  const [Blogs, setBlogs] = useState([]);
  let firestore = getFirestore(app);
  let auth = getAuth(app)
  let [user,Setuser] = useState();
  let navigate = useNavigate();
  useEffect(()=>{
  onAuthStateChanged(auth,(user)=>{
       Setuser(user);
     })
  },[auth])
  const dataarr = [];
  useEffect(()=>{
    const fetchData = () => {
      onSnapshot(collection(firestore,"blogs"),(SnapShot)=>{
        SnapShot.docs.map((blog)=>{
          // return setBlogs({id:blog.id,...blog.data()})
          dataarr.push({id:blog.id,...blog.data()})
        })
        setBlogs(dataarr)
      })
    };
   fetchData();
 },[firestore]);

  const removeImage = (html) => {
        if (Blogs) {
           const tempDiv = document.createElement('div');
               tempDiv.innerHTML = html;
                const images = tempDiv.getElementsByTagName('img');
                
               for (let i = images.length - 1; i >= 0; i--) {
                  // images[i].parentNode.removeChild(images[i])
                   images[i].style.display = "none";
               }
             
              if(tempDiv.innerText.length >= 250){
                return tempDiv.innerText.substring(0,250);
              }
              else return tempDiv.innerText;
     }
      }
      
  return (
    <div>
    <Nav/>
    <div id='container'>
    {Blogs.length>0? Blogs.map((item, index) => {
     return (
       <article className="post" key={index}>
        <Link to={`/post/${item.id}`}>
        <div className="post_thumbnail">
           <img src={item.Thumbnail} alt={item.title} id="thumbnail" style={{height:"192px",objectFit:"cover"}}/>
         </div>
         </Link>
        <Link to={`/post/${item.id}`}>
         <div className="post_content" >
           <h4 id="title">{item.title}</h4>
           { <div id="desc" dangerouslySetInnerHTML={{ __html: removeImage(item.description)}}></div>}
         
         <div className="post_footer" >
           <p id="author">Dev khatri</p>
           <p id="category">{item.category}</p>
         </div>
         </div>
         </Link>
     </article> 
      )
    }):<p>No Blogs</p>}
    </div>
    </div>
  )
}

export default Blogs
