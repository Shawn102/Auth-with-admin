import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msg, setMsg] = useState<any>(null);
  const register = () => {
    axios
      .post(
        "http://localhost:4200/register",
        { username, password },
        { withCredentials: true }
      )
      .then((res: AxiosResponse) => {
        if (res.data) {
          if (res.data === "success") {
            console.log(res.data);
            window.location.href = "/login";
          }
          if (res.data === "User already exist") {
            setMsg(res.data);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const setTime = setTimeout<any>(() => {
      setMsg(null);
    }, 2000);
    return () => {
      clearTimeout(setTime);
    };
  }, [msg]);

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
      {msg ? <p>{msg}</p> : null}
    </div>
  );
};

export default Register;
