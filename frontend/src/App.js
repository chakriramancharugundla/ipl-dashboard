import React from "react"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import ResponsesDashboard from "./components/responsesDashboard";
import UserResponsesTable from "./components/userResponsesTable";
import SelectAnswers from "./components/selectAnswers"
import AdminPanel from "./components/Admin";

function App() {
  
  
  

  return (
    <Router>
      <Routes>
      <Route path="/admin/admin" element={<AdminPanel/>} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<SelectAnswers/>} />
        <Route path="/allresponses" element={<ResponsesDashboard />} />
        <Route path="/userresponses" element={<UserResponsesTable />} />
      </Routes>
    </Router>
  );
}

export default App;
