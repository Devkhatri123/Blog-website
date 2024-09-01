import React, { useState } from 'react'
import "../CSS/Signin.css";
import Nav from './nav';
import { Link , useNavigate } from 'react-router-dom';
import { app } from '../Firebase/firebase';
import { signInWithEmailAndPassword,getAuth } from 'firebase/auth';
const Signin = () => {
    let [email,setemail] = useState();
    let [password,setpassword] = useState();
    let [loading,setloading] = useState(false);
    let [Error,setError] = useState();
    let navigate = useNavigate();
    let auth = getAuth(app);
    let Signin = async() => {
        setloading(true);
       document.getElementById("loading").style.opacity = "0.2";
    await signInWithEmailAndPassword(auth,email,password).then((res)=>{
        setloading(false);
        console.log(res);
       document.getElementById("loading").style.opacity = "unset";
        navigate("/");
    }).catch((error)=>{
       setloading(false);
      document.getElementById("loading").style.opacity = "unset";
       setError(error.message);
    })
}
  return (
    <>
     <div id="loading">
      <Nav />
      <div className="register">
        <h2>LogIn</h2>
        {Error ? <p id="error">{Error}</p> : null}
        {/* <p id='error'></p> */}
        <div className="container">
          <form method="POST" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <br />
            <div className="btn_container">  <button type="submit" id="btn" onClick={Signin}>
               LogIn
              </button></div>
              <p id="dont_have_account">Dont have an account ?   <Link to="/SignUp">SignUp</Link></p>
          </form>
        </div>
      </div>
      </div>
      {loading ? (
      <div className="loader"></div>
      ) : null}
    </>
  )
}

export default Signin
