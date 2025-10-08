import img from "../img/imaage.png";
import { deleteContact } from "../api/contact";
import { useState } from "react";

const DeleteContact = ({ open, onClose, contactId }) => {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleDeleteContact = async () => {

    setLoading(true);

    try {

      const status = await deleteContact(contactId);
     
       if (status === 200) {
    
      onClose();
    } else {
      console.error("Suppression échouée :", status);
    }

    } catch (e) {
      console.error("Erreur suppression contact :", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="modalContainer"
      >
        <img src={img} alt="delete modal" />
        <div className="modalRight">
          <p className="closeBtn" onClick={onClose}>
            X
          </p>

          <div className="contenut">
            <p>Souhaitez-vous vraiment supprimer ce contact ?</p>
          </div>

          <div className="btnContainer">
            <button onClick={onClose} className="modalButton">
              Non
            </button>
            <button
              onClick={handleDeleteContact}
              className="modalButton danger"
              disabled={loading}
            >
              {loading ? "Suppression..." : "Oui, supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteContact;
