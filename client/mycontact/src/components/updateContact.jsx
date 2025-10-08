import { useState } from 'react';
import { updateContact } from '../api/contact';
import img from '../img/imaage.png';
import { useNavigate } from 'react-router-dom';

const UpdateContact = ({ open, onClose, contactToUpdate }) => {

  const [newFirstName, setNewFirstName] = useState(contactToUpdate.firstName || '');
  const [newLastName, setNewLastName] = useState(contactToUpdate.lastName || '');
  const [newPhone, setNewPhone] = useState(contactToUpdate.phone || '');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleUpdateContact = async (event) => {
    event.preventDefault();

    const data = {
      firstName: newFirstName,
      lastName: newLastName,
      phone: newPhone,
    };

    const contactId = contactToUpdate._id
try {
  const status = await updateContact(contactId, data);
    console.log("Contact mis à jour avec succès !");
    onClose();
} catch (error) {
  if (error.response?.data?.message) {
    setError("Erreur lors de la mise à jour : " + error.response.data.message);
  } else {
    setError("Une erreur s'est produite lors de la modification.");
  }
}

  };

  return (
    <div onClick={onClose} className="overlay">
      <div onClick={(e) => e.stopPropagation()} className="modalContainer">
        <img src={img} alt="update contact" />
        <div className="modalRight">
          <p className="closeBtn" onClick={onClose}>X</p>

          <div className="contenut">
            <span id="register-label">Modifier le contact</span>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleUpdateContact}>
              <input
                className="input"
                type="text"
                placeholder="Prénom"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                required
              />
              <input
                className="input"
                type="text"
                placeholder="Nom"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                required
              />
              <input
                className="input"
                type="text"
                placeholder="Téléphone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />

              <div className="btnContainer">
                <button type="submit" className="btn btn-update">Modifier</button>
                <button type="button" className="btn btn-cancel" onClick={onClose}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateContact;
