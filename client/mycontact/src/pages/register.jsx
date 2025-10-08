import { useState } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleRegister = async (event) => {
    event.preventDefault();

    const data = {
      lastName: lastName,
      firstName: firstName,
      phone: phone,
      email: email,
      password: password,
    };

    if (confirmPassword !== password) {
      setError('Les mots de passe ne correspondent pas.');
    } else {
      await registerUser(data)
        .then((data) => {
          navigate('/login');
        })
        .catch((e) => {
          console.log("register catch error",e)
          if (error.response.data.message) {
            setError(
              "Une erreur s'est produite lors de l'inscription : " +
                error.response.data.message,
            );
          } else {
            setError("Une erreur s'est produite lors de l'inscription.");
          }
        });
    }
  };

  return (
    <>
      <div className="form-container">
        <form className="form" onSubmit={handleRegister}>
          <span id="register-label">S'INSCRIRE !</span>
          <input
            className="input"
            type="text"
            placeholder="Prénom"
            pattern="[A-Za-z]{3,15}"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Nom"
            pattern="[A-Za-z]{3,15}"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="input"
            type="number"
            placeholder="N° de téléphone"
            pattern="^(?:0[1-9](?:[\s.-]?\d{2}){4}|\+33\s?[1-9](?:[\s.-]?\d{2}){4})$"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Email"
            pattern="^(?=[^?=%]*[@]{1}[^?=%]*)[^?=%]{10,50}$"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Mot de passe"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}"
            minLength="8"
            maxLength="15"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Confirmer votre mot de passe"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}"
            minLength="8"
            maxLength="15"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            S'INSCRIRE
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
