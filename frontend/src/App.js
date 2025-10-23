import React, { useState} from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import CoursesPage from "./Pages/CoursesPage";
import RegistrationsPage from "./Pages/RegistrationsPage";
import HomePage from "./Pages/HomaPage";
import 'bootstrap/dist/css/bootstrap.min.css';




function AppContent() {
  const[token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();


  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
   
      <div>
        <Navbar token={token} handleLogin={handleLogin} onLogout={handleLogout} />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn onLogin = {handleLogin}/>} />
          <Route path="/homepage" element={<HomePage/> } />
          <Route path="/coursespage" element={<CoursesPage />} />
          <Route path="/registrationspage" element={<RegistrationsPage />} />
        </Routes>
      </div>
  
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
