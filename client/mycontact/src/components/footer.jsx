import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BiLogoInstagram,
  BiLogoWhatsapp,
  BiSolidEnvelope,
  BiLogoSnapchat,
} from 'react-icons/bi';
import logo from '../img/logoo.png';

function Footer() {
  return (
    <footer>
      <div className="nav-logo">
        <NavLink to="/" exact="true">
          <img className="logoo" src={logo} alt="Logo" />
        </NavLink>
      </div>

      <div className="pages">
        <ul>
          <li>
            <NavLink to="/" exact="true">
              ACCUEIL
            </NavLink>
          </li>
          <li>
            <NavLink to="/femme" exact="true">
              {' '}
              FEMME{' '}
            </NavLink>
          </li>
          <li>
            <NavLink to="/homme" exact="true">
              {' '}
              HOMME{' '}
            </NavLink>
          </li>
          <li>
            <NavLink to="/panier" exact="true">
              {' '}
              PANIER{' '}
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" exact="true">
              {' '}
              CONTACT{' '}
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="ressources">
        <ul>
          <li><a href='https://watch-brussels.be/politique-de-confidentialite'>Politique de confidentialité</a></li>
          <li><a href='https://watch-brussels.be/conditions-generales'>Conditions générales de vente</a> </li>
          <li><a href='https://watch-brussels.be/politique-de-cookies-ue'>Politique de cookies(UE)</a></li>
          <li><a href='https://watch-brussels.be/mentions-legales'>Mentions Légales</a></li>
          <li><a href='https://watch-brussels.be/livraison'>Livraison</a></li>
        </ul>
      </div>
      <div className="reseaux">
        <ul>
          <li>
            <BiLogoInstagram style={{ fontSize: '2em' }} />
          </li>
          <li>
            <BiSolidEnvelope style={{ fontSize: '2em' }} />
          </li>
          <li>
            <BiLogoSnapchat style={{ fontSize: '2em' }} />
          </li>
          <li>
            <BiLogoWhatsapp style={{ fontSize: '2em' }} />
          </li>
        </ul>
        <hr />
        <div className="contact">
          <ul>
            <li>O'CLOCK</li>
            <li>N° +33 467 7833 80 </li>
            <li>MAIL : contact@oclock.com</li>
            <li>TVA: FR 0768.453.497</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
