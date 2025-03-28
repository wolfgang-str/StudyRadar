import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import SignUp from "./signup";
import Dashboard from "./Dashboard";
import About from "./Aboutus";
import UserProfile from "./UserProfile";
import GroupPage from "./GroupPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} /> {/* Redirect "/" to login */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/groups" element={<GroupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
