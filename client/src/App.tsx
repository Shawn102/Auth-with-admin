import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AdminPage from "./Pages/AdminPage";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import "./main.css";
import Register from "./Pages/Register";
import { myContext } from "./context";
import ErrorPage from "./Pages/ErrorPage";

function App() {
  const ctx = useContext(myContext);
  console.log(ctx);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {ctx ? (
          <>
            <Route path="/profile" element={<Profile />} />
            {ctx.isAdmin ? (
              <Route path="/admin" element={<AdminPage />} />
            ) : null}
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
