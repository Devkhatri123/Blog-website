import "./App.css";
import SignUp from "../src/Components/SignUp";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from "../src/Components/Signin";
import Blogs from "../src/Components/Blogs";
import  Post  from "../src/Components/Post";
import CreatePost from "../src/Components//CreatePost";
import Edit from "../src/Components/Edit";
function App() {
  return (
   <div>
   {/* <SignUp/> */}
   <Router basename={process.env.PUBLIC_UR}>
    <Routes>
    <Route path="/" element={<Blogs/>} />
    <Route path="/login" element={<Signin/>} />
    <Route path="/SignUp" element={<SignUp/>} />
    <Route path="/post/:id" element={<Post/>} />
    <Route path="/createblog" element={<CreatePost/>} />
    <Route path="/edit/:id" element={<Edit/>} />
        </Routes>
    </Router>
   </div>
  );
}

export default App;
