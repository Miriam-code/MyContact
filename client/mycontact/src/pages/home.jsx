import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import env from 'react-dotenv';
import Footer from '../components/footer';

const Home = () => {

  useEffect(() => {
   
  }, []);

  return (
    <div>

      <div className="collection">
        <NavLink to="/register">
          <button className="btn-12">
            <span>S'inscrire &rarr;</span>
          </button>
        </NavLink>
        <NavLink to="/login">
          <button className="btn-12">
            <span>Se connecter &rarr;</span>
          </button>
        </NavLink>
      </div>

  
    </div>
  );
};

export default Home;
