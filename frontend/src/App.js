import React from "react"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import ResponsesDashboard from "./components/responsesDashboard";
import UserResponsesTable from "./components/userResponsesTable";
import SelectAnswers from "./components/selectAnswers"

function App() {
  
  
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<SelectAnswers/>} />
        <Route path="/allresponses" element={<ResponsesDashboard />} />
        <Route path="/userresponses" element={<UserResponsesTable />} />
      </Routes>
    </Router>
  );
}

export default App;
