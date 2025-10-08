import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../AuthContext/Usercontext';
import DeleteUser from '../components/deleteUser';
import UpdateUser from '../components/updateUser';

const Profile = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const { user } = useContext(UserContext);
  //const  userId = user.id

  console.log("userid profile", user._id )

  useEffect(() => {
   
  }, []);

  return user != null ? (
    <>
      <div className="form-container">
        <div className="cardprofil">
          <span id="register-label">MON PROFILE!</span>
          <p>Prénom : {user.firstName} </p>
          <p>Nom : {user.lastName} </p>
          <p>N°: {user.phone} </p>
          <p>Mail : {user.email} </p>
          <div className="collection">
            <button
              onClick={() => setOpenUpdateModal(true)}
              className="modalButton"
            >
              {' '}
              MODIFIER{' '}
            </button>
            <button
              onClick={() => setOpenDeleteModal(true)}
              className="modalButton"
            >
              {' '}
              SUPPRIMER{' '}
            </button>
          </div>
          <UpdateUser
            open={openUpdateModal}
            onClose={() => setOpenUpdateModal(false)}
            userToUpdate={user}
          />
          <DeleteUser
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            userId={user._id}
          />
        </div>
      </div>
    </>
  ) : null;
};

export default Profile;
