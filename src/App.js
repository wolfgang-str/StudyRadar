import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import SignUp from "./signup";

import Dashboard from "./Dashboard";
import About from "./Aboutus";
import UserProfile from "./UserProfile";
import GroupPage from "./GroupPage";
import Layout from "./Layout"; 
import GroupCreation from './GroupCreation';
import GroupDetail from './GroupDetail';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} /> {/* Redirect "/" to login */}

          {/* Pages that share the Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/create-group" element={<GroupCreation />} />
            <Route path="/group/:groupId" element={<GroupDetail />} />
          </Route>
          <Route path="/about" element={<About />} />


          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/groups" element={<GroupPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
