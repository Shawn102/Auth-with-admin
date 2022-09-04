import React, { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { UserInterface } from "../Interfaces/Interfaces";
import { myContext } from "../context";

const AdminPage = () => {
  const ctx = useContext(myContext);
  const [data, setData] = useState<UserInterface[]>();
  const [selectedUser, setSelectedUser] = useState<string>();

  useEffect(() => {
    axios
      .get("http://localhost:4200/getAllUsers", { withCredentials: true })
      .then((res: AxiosResponse) => {
        if (res.data) {
          console.log(res.data);
          setData(
            res.data.filter((item: UserInterface) => {
              return item.username !== ctx.username;
            })
          );
        }
      });
  }, [ctx]);
  if (!data) {
    return null;
  }
  //   delete user
  const deleteUser = () => {
    let userId: any;
    data.map((user: any) => {
      if (user.username === selectedUser) {
        userId = user._id;
      }
    });
    axios
      .post(
        "http://localhost:4200/deleteUser",
        { id: userId },
        { withCredentials: true }
      )
      .then((res: AxiosResponse) => {
        if (res.data) {
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        name="deleteuser"
        id="deleteuser"
      >
        <option id="Select a user">Select A User</option>
        {data.map((item: UserInterface) => {
          return (
            <option key={item.username} id={item.username}>
              {item.username}
            </option>
          );
        })}
      </select>
      <button onClick={deleteUser}>Delete User</button>
    </div>
  );
};

export default AdminPage;
