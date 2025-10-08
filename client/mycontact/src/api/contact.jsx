import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createContact = async (data) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(`${API_URL}/contact`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getContacts = async () => {

  const token = localStorage.getItem("token"); 
  return await axios({
    method: 'get',
    url: `http://localhost:3000/contact/all`,headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.data.contacts;
    })
    .catch((e) => {
      console.log(e);
    });
};

export const deleteContact = async (contactId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(`${API_URL}/contact/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Suppression réussie :", res.status);
    return res.status; 

  } catch (error) {
    console.error("Erreur lors de la suppression :", error.response?.data || error.message);
    throw error; 
  }
};


export const updateContact = async (contactId, data) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios({
      method: 'put',
      url: `${API_URL}/contact/${contactId}`,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response api status", res.status);
    return res.status; 
  } catch (e) {
    console.error("Erreur API:", e.response?.data || e.message);
    throw e;
  }
};

