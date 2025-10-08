import { useEffect, useState } from "react";
import { getContacts } from "../api/contact";
import UpdateContact from "../components/updateContact";
import DeleteContact from "../components/DeleteContact"

const ContactList = ({ refresh }) => {
  const [contactList, setContactList] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    getContacts()
      .then((contacts) => setContactList(contacts))
      .catch((e) => console.log(e));
  }, [refresh, openUpdateModal,openDeleteModal]);

  const openUpdate = (contact) => {
    setSelectedContact(contact);
    setOpenUpdateModal(true);
  };

  const openDelete = (contact) => {
    setSelectedContact(contact);
    setOpenDeleteModal(true);
  };

  return (
    <div className="contacts-container">
      <h3 className="content__author">Mes Contacts</h3>

      {contactList.length === 0 ? (
        <p>Aucun contact pour le moment.</p>
      ) : (
        <ul className="contacts-list">
          {contactList.map((contact) => (
            <li key={contact._id} className="contact-item">
              <div className="contact-info">
                <p><strong>{contact.firstName}</strong> {contact.lastName}</p>
                <p>{contact.phone}</p>
              </div>

              <div className="contact-actions">
                <button
                  onClick={() => openUpdate(contact)}
                  className="modalButton"
                >
                  Modifier
                </button>
                <button
                  onClick={() => openDelete(contact)}
                  className="modalButton danger"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {openUpdateModal && (
        <UpdateContact
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          contactToUpdate={selectedContact}
        />
      )}

      {openDeleteModal && (
        <DeleteContact
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          contactId={selectedContact._id}
        />
      )}
    </div>
  );
};

export default ContactList;
