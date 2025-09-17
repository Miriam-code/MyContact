import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtUtils from "../middleware/jwtUtils.js";
import validator from "validator";

const saltRounds = 10;
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export default {
  register: async (req, res) => {
    const { lastName, firstName, phone, email, password } = req.body;

    if (
      lastName == "" ||
      firstName == "" ||
      email == "" ||
      password == "" ||
      phone == ""
    ) {
      return res
        .status(500)
        .json({ message: "Veuillez remplir tous les champs." });
    }

    const nameRegex = /^[A-Za-z]{3,15}$/;
    if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
      return res.status(400).json({
        message:
          "Les noms ne sont pas valides. Ils doivent contenir uniquement des lettres et avoir une longueur de 3 à 15 caractères.",
      });
    }

    if (!regexPassword.test(password)) {
      return res.status(403).json({ message: "Mot de passe invalide" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    try {
      const user = await User.findOne({ where: { email: email } });

      if (user === null) {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Erreur serveur." });
          }

          const newUser = new User({
            firstName,
            lastName,
            phone,
            email,
            password: hash,
            is_admin: true,
          });

          await newUser.save();

          if (newUser) {
            return res.status(200).json({ message: "Utilisateur créé" });
          } else {
            return res.status(500).json({ message: "Erreur serveur." });
          }
        });
      } else {
        return res
          .status(400)
          .json({ message: "Cet email existe déjà, veuillez-vous connecter." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },

  auth: async (req, res) => {
    const { email, password } = req.body;

    if (email == "" || password == "") {
      return res
        .status(500)
        .json({ message: "Veuillez remplir tous les champs." });
    }
    if (!regexPassword.test(password)) {
      return res.status(403).json({ message: "invalid password" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "invalid email" });
    }
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      const password_valid = await bcrypt.compare(password, user.password);

      if (password_valid) {
        const expirationTime = 36000;
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            is_admin: user.is_admin,
          },
          process.env.SECRET,
          { expiresIn: expirationTime }
        );
        return res.status(200).json({ token: token });
      } else {
        return res.status(400).json({ error: "Password Incorrect" });
      }
    } else {
      return res.status(404).json({ error: "User n'exist pas" });
    }
  },

  updateUser: async (req, res) => {
    const id = req.params.id;

    const { lastName, firstName, email, phone, password } = req.body;

    if (password && !regexPassword.test(password)) {
      return res.status(403).json({ message: "Mot de passe invalide" });
    }

    const user = await User.findOne({ where: { id } });

    if (id !== user.id || user.is_admin) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (password) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        await user
          .update({
            lastName: lastName ? lastName : user.lastName,
            firstName: firstName ? firstName : user.firstName,
            phone: phone ? phone : user.phone,
            email: email ? email : user.email,
            password: hash,
          })
          .then(() => {
            return res.status(200).json({ message: "Modification effectuée" });
          })
          .catch(() => {
            return res
              .status(400)
              .json({ message: "Erreur lors de la modification" });
          });
      });
    } else {
      await user
        .update({
          lastName: lastName ? lastName : user.lastName,
          firstName: firstName ? firstName : user.firstName,
          phone: phone ? phone : user.phone,
          email: email ? email : user.email,
        })
        .then(() => {
          return res.status(200).json({ message: "Modification effectuée" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ message: "Erreur lors de la modification" });
        });
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({ where: { id: id } });

    if (id !== user.id || user.is_admin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    if (user) {
      await User.destroy({
        where: { id: id },
      })
        .then(() => {
          return res.status(200).json({ message: "utilisateur supprimé" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ message: "erreur lors de la suppression" });
        });
    }
  },

  getAllUsers: async (req, res) => {
    if (req.params.is_admin === 1) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    await User.findAll()
      .then((users) => {
        return res.status(200).json({ users: users });
      })
      .catch(() => {
        return res.status(400).json({ message: "une erreur est survenue." });
      });
  },

  getUserProfile: async (req, res) => {
    const authorization = req.headers["authorization"];

    const userId = jwtUtils.getUser(authorization);

    if (userId == null || userId == -1) {
      return res.status(401).json({ message: "Aucun utilisateur" });
    }

    await User.findOne({ where: { id: userId } })
      .then((user) => {
        return res.status(200).json({ user: user });
      })
      .catch(() => {
        return res.status(400).json({ message: "Utilisateur pas trouvé" });
      });
  },
};
