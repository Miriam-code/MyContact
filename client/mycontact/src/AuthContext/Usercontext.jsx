import React, { createContext, useState } from 'react';
import { getUserInfo } from '../api/auth';

const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const saveUser = async () => {
    const token = localStorage.getItem('token');

    await getUserInfo(token)
      .then((data) => {
        setUser(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token');

  };


  return (
    <UserContext.Provider value={{ user, saveUser, logoutUser }}>    
      {children}     
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
