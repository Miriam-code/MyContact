
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { createContact } from '../api/contact';
import  ContactList  from '../components/contactList';

const Contact = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(0);

  useEffect(() => {
   
  }, []);

   const handleContact = async (event) => {
      event.preventDefault();

      const data = {
      lastName: lastName,
      firstName: firstName,
      phone: phone,
      };

      try {
           const newContact = await createContact(data);
           setRefresh(prev => prev + 1);
           setFirstName('')
           setLastName('')
           setPhone('')
           setError('')
    
        } catch (error) {
           console.error("Erreur création contact:", error);
           if (error.response?.status === 400) {
           setError(error.response.data.message || "Numéro de téléphone déjà existant.");
           } else {
           setError("Une erreur s'est produite lors de la création du contact.");
           }
        }    
    };

  return (
    <div>

      <div className="form-container">
        <form className="form" onSubmit={handleContact}>
          <span id="register-label">Nouveau contact</span>
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

          {error && <div className="error">{error}</div>}

          <button className="btn" type="submit">
           Créer
          </button>
        </form>
      </div>

      <div>
        <ContactList refresh={refresh} />
      </div>

    </div>
  );
};

export default Contact;
