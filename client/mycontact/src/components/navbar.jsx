import React, { useContext } from 'react';
import { UserContext } from '../AuthContext/Usercontext';
import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../img/imaage.png';
import { BiMenu } from 'react-icons/bi';
import '../App.css';

const CustomNavbar = () => {
  const token = localStorage.getItem('token');

  const { logoutUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-logo">
        <NavLink to="/" exact="true">
          <img className="logoo" src={logo} alt="Logo" />
        </NavLink>
      </div>

      <input type="checkbox" id="check" className="check" />
      <label htmlFor="check" className="checkbtn">
        <BiMenu style={{ fontSize: '2em' }} />
      </label>

      <div className="nav-content">
        {!token ? (
          <>
            <span>
              <NavLink to="/" exact="true">
                ACCUEIL
              </NavLink>
            </span>
            <span>
              <NavLink to="/register" exact="true">
                S'INSCRIRE
              </NavLink>
            </span>
            <span>
              <NavLink to="/login" exact="true">
                CONNEXION
              </NavLink>
            </span>
            
          </>
        ) : (
          <>
             <NavLink to="/contact" exact="true">
              CONTACTS
            </NavLink>
            <NavLink to="/profile" exact="true">
              PROFIL
            </NavLink>

            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default CustomNavbar;
