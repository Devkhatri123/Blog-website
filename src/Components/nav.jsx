import React from 'react';
import { useState,useEffect } from 'react';
import '../CSS/nav.css';
import {useNavigate} from "react-router-dom"
import blog from "../Blogger-logo.png";
import { Link } from 'react-router-dom';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { app } from '../Firebase/firebase';
const Nav = (props) => {
  let auth = getAuth(app);
  let navigate = useNavigate();
  let [user , Setuser] = useState(null);
  let signout = ()=>{
    auth.signOut();
    navigate("/");
  }
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
  let createpost = () => {
    if(user){
      navigate("/createblog");
    }else{
      navigate("/blogs");
      alert("Please Sign In first then you can create and publish post");
    }
  }
  
  return (
    <div>
      <nav>
        <img src={blog} alt="logo" id='logo'/>
        <div className='lists'>
          <li><Link to="/blogs">Home</Link></li>
          <li onClick={createpost}><Link to="/createblog">Create Post</Link></li>
          {!user ?  <li><Link to="/login">Login</Link></li> : <li onClick={signout}>{user?.displayName}</li>}
        </div>
        </nav>    
     </div>
  )
}

export default Nav;
