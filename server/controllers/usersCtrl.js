import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUser } from "../middlewares/jwtUtils.js";
import validator from "validator";

const saltRounds = 10;
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default {
  
  register: async (req, res) => {
    try {
      const { lastName, firstName, phone, email, password } = req.body;

      if (!lastName || !firstName || !phone || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
      }

      const nameRegex = /^[A-Za-z]{3,15}$/;
      if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
        return res.status(400).json({
          message:
            "Les noms doivent contenir uniquement des lettres (3 à 15 caractères).",
        });
      }

      if (!validator.isMobilePhone(phone, "fr-FR")) {
        return res.status(400).json({ message: "Numéro de téléphone invalide." });
      }

      if (!regexPassword.test(password)) {
        return res.status(400).json({ message: "Mot de passe invalide." });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email invalide." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      const hash = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        firstName,
        lastName,
        phone,
        email,
        password: hash,
        is_admin: false,
      });

      await newUser.save();
      return res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },

  auth: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Champs manquants." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect." });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          is_admin: user.is_admin,
        },
        process.env.SECRET,
        { expiresIn: "10h" }
      );

      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },

  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const { lastName, firstName, email, phone, password } = req.body;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

      let updateData = {
        lastName: lastName || user.lastName,
        firstName: firstName || user.firstName,
        email: email || user.email,
        phone: phone || user.phone,
      };

      if (password) {
        if (!regexPassword.test(password)) {
          return res.status(400).json({ message: "Mot de passe invalide." });
        }
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await User.findByIdAndUpdate(id, updateData);
      return res.status(200).json({ message: "Utilisateur mis à jour." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);

      if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

      await User.deleteOne({ _id: id });
      return res.status(200).json({ message: "Utilisateur supprimé." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const authorization = req.headers["authorization"];
      const userId = getUser(authorization);

      if (!userId || userId === -1) {
        return res.status(401).json({ message: "Utilisateur non autorisé." });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

      return res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },
};
