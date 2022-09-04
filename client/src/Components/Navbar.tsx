import axios, { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { myContext } from "../context";

const Navbar = () => {
  const ctx = useContext(myContext);

  const logout = () => {
    axios
      .get("http://localhost:4200/logout", { withCredentials: true })
      .then((res: AxiosResponse) => {
        if (res.data) {
          console.log(res.data);
          window.location.href = "/";
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <nav className="NavContainer">
      <Link to="/">Home</Link>
      {ctx ? (
        <>
          <Link to="/profile">Profile</Link>
          {ctx.isAdmin ? <Link to="/admin">Admin</Link> : null}
          <Link onClick={logout} to="/logout">
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
