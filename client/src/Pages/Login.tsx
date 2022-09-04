import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = () => {
    axios
      .post(
        "http://localhost:4200/login",
        { username, password },
        { withCredentials: true }
      )
      .then((res: AxiosResponse) => {
        if (res.data) {
          console.log(res.data);
          window.location.href = "/profile";
        }
      });
  };
  const getUser = () => {
    axios
      .get("http://localhost:4200/user", { withCredentials: true })
      .then((res: AxiosResponse) => {
        console.log(res.data);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <button onClick={getUser}>Get User Credentials</button>
    </div>
  );
};

export default Login;
