import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// pages
import './App.css';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';
import Profile from './pages/profile';
import Contact from './pages/contact';

//components
import CustomNavbar from './components/navbar';
import { UserContext } from './AuthContext/Usercontext';

const RoutesApp = () => {
  const { saveUser } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      saveUser();
    }
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <CustomNavbar />
      <Routes>
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
};

export default RoutesApp;
