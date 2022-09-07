import React from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Plans from "./components/Plans";
import Payment from "./components/Payment";
import Dashboard from "./components/Dashboard";

import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/plan" element={<Plans />}></Route>
        <Route exact path="/payment" element={<Payment />}></Route>
        <Route exact path="/" element={<Dashboard />}></Route>
      </Routes>
    </div>
  );
}

export default App;
