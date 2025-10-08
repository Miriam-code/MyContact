import Contact from "../models/Contact.js";
import validator from "validator";

const contactsCtrl = {

  getContacts: async (req, res) => {

    try {
        
      const userId  = req.user.id;
      console.log("userid ctrl", userId)
      const contacts = await Contact.find({ user:  userId });
      console.log("contacts ctrl ", contacts)

      res.status(200).json({ contacts });

    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  createContact: async (req, res) => {

    const userId = req.user.id;
    console.log("controller create", userId)
    const { firstName, lastName, phone } = req.body;
   
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

   if (!validator.isMobilePhone(phone, "fr-FR")) {
      return res.status(400).json({ message: "Numéro de téléphone invalide" });
    }

    const contactExist = await Contact.findOne({ phone, user: userId });

    if (contactExist) {
      return res.status(400).json({ message: "Contact existe déjà" });
    }

    try {
      const newContact = new Contact({
        firstName,
        lastName,
        phone,
        user: userId,
      });

      console.log('controller contact', newContact)


      await newContact.save();
      res.status(201).json({ message: "Contact créé", contact: newContact });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },


  updateContact: async (req, res) => {
    
    const { id } = req.params;
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

      console.log("controller update", userId)
    
    if (phone && !validator.isMobilePhone(phone, "fr-FR")) {
        return res.status(400).json({ message: "Numéro de téléphone invalide" });
    }

    try {

      const contact = await Contact.findOne({ _id: id, user: userId });

      if (!contact) return res.status(404).json({ message: "Contact non trouvé" });

      if (phone && phone !== contact.phone) {

        const contactExist = await Contact.findOne({ phone, user: userId });

        if (contactExist) {
          return res.status(400).json({ message: "Un contact avec ce numéro existe déjà" });
        }
      }

      if (firstName) contact.firstName = firstName;
      if (lastName) contact.lastName = lastName;
      if (phone) contact.phone = phone;

      await contact.save();
      res.status(200).json({ message: "Contact mis à jour", contact });

    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },


  deleteContact: async (req, res) => {

    const userId  = req.user.id;
    const { id } = req.params;

    console.log("controller delete", userId, id)

    try {
      const contact = await Contact.findOneAndDelete({ _id: id, user: userId });

      if (!contact) return res.status(404).json({ message: "Contact non trouvé" });

      res.status(200).json({ message: "Contact supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};

export default contactsCtrl;
