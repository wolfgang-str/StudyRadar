import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import SignUp from "./signup"; // Ensure correct import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} /> {/* Redirect "/" to login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
