import React from "react";
import { useState } from "react";
import { app } from "../Firebase/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Nav from "./nav";
import "../CSS/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
const SignUp = ({html}) => {
  let auth = getAuth(app);
  let [name, setname] = useState("");
  let [email, setemail] = useState("");
  let [password, setpassword] = useState("");
  let [loading, setloading] = useState(false);
  let [Error, SetError] = useState();
  let navigate = useNavigate();
  const CreateUser = async () => {
    setloading(true);
  document.getElementById("loading").style.opacity = "0.2";
    await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setloading(false);
        let user = res.user;
        updateProfile(user, {
          displayName: name,
        });
      document.getElementById("loading").style.opacity = "unset";
        navigate("/blogs");
      })
      .catch((error) => {
        setloading(false);
      document.getElementById("loading").style.opacity = "unset";
        SetError(error.message);
        console.log(error);
      });
  };
  return (
    <>
   <div id="loading">
      <Nav />
      <div className="register">
        <h2>Sign Up</h2>
        {Error ? <p id="error">{Error}</p> : null}
        <div className="container">
          <form method="POST" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="name"
              placeholder="Name "
              id="name"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <br />
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
            <div className="btn_container">  <button type="submit" id="btn" onClick={CreateUser}>
                Register
              </button></div>
              <p id="dont_have_account">Already have an account ?   <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
      </div>
      {loading ? (
      <div className="loader"></div>
      ) : null}
     {/* <div dangerouslySetInnerHTML={{ __html:html }} /> */}
      </>
  );
};

export default SignUp;
