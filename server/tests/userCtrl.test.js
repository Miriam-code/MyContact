import userCtrl from "../controllers/usersCtrl.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { getUser } from "../middlewares/jwtUtils.js";

jest.mock("../models/User.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("validator");
jest.mock("../middlewares/jwtUtils.js");

describe(" User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        phone: "0601020304",
        email: "john@example.com",
        password: "Password1",
      },
      params: { id: "user123" },
      headers: { authorization: "Bearer faketoken" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // REGISTER
  describe("register", () => {
    it("✅ crée un utilisateur", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(true);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpwd");

      User.prototype.save = jest.fn().mockResolvedValue();

      await userCtrl.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("Password1", 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur créé avec succès.",
      });
    });

    it("❌ champs manquants", async () => {
      req.body = { firstName: "John" };
      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tous les champs sont requis.",
      });
    });

    it("❌ nom invalide", async () => {
      req.body.firstName = "J";
      req.body.lastName = "Doe";
      validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(true);
      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("❌ téléphone invalide", async () => {
      validator.isMobilePhone.mockReturnValue(false);
      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Numéro de téléphone invalide.",
      });
    });

    it("❌ mot de passe invalide", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(true);
      req.body.password = "abc";
      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mot de passe invalide.",
      });
    });

    it("❌ email invalide", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(false);
      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email invalide.",
      });
    });

    it("❌ email déjà utilisé", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(true);
      User.findOne.mockResolvedValue({ email: "john@example.com" });

      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cet email est déjà utilisé.",
      });
    });

    it("❌ erreur serveur", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      validator.isEmail.mockReturnValue(true);
      User.findOne.mockRejectedValue(new Error("DB error"));
      await userCtrl.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur serveur.",
      });
    });
  });

  // AUTH

  describe("auth", () => {
    it("✅ authentifie un utilisateur", async () => {
      const mockUser = {
        _id: "user123",
        email: "john@example.com",
        password: "hashed",
        firstName: "John",
        lastName: "Doe",
        is_admin: false,
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("jwtToken");

      await userCtrl.auth(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "jwtToken" });
    });

    it("❌ champs manquants", async () => {
      req.body = {};
      await userCtrl.auth(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("❌ utilisateur non trouvé", async () => {
      User.findOne.mockResolvedValue(null);
      await userCtrl.auth(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("❌ mot de passe incorrect", async () => {
      User.findOne.mockResolvedValue({ password: "hash" });
      bcrypt.compare.mockResolvedValue(false);
      await userCtrl.auth(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("❌ erreur serveur", async () => {
      User.findOne.mockRejectedValue(new Error("DB error"));
      await userCtrl.auth(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // UPDATE USER
  describe("updateUser", () => {
    it("✅ met à jour un utilisateur", async () => {
      const mockUser = {
        _id: "user123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0601020304",
      };
      User.findById.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue("hashedPwd");
      User.findByIdAndUpdate.mockResolvedValue();

      await userCtrl.updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur mis à jour.",
      });
    });

    it("❌ utilisateur introuvable", async () => {
      User.findById.mockResolvedValue(null);
      await userCtrl.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("❌ mot de passe invalide", async () => {
      User.findById.mockResolvedValue({});
      req.body.password = "bad";
      await userCtrl.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mot de passe invalide.",
      });
    });

    it("❌ erreur serveur", async () => {
      User.findById.mockRejectedValue(new Error("DB error"));
      await userCtrl.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // DELETE USER

  describe("deleteUser", () => {
    it("✅ supprime un utilisateur", async () => {
      User.findById.mockResolvedValue({ _id: "user123" });
      User.deleteOne.mockResolvedValue();

      await userCtrl.deleteUser(req, res);

      expect(User.deleteOne).toHaveBeenCalledWith({ _id: "user123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur supprimé.",
      });
    });

    it("❌ utilisateur introuvable", async () => {
      User.findById.mockResolvedValue(null);
      await userCtrl.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("❌ erreur serveur", async () => {
      User.findById.mockRejectedValue(new Error("DB error"));
      await userCtrl.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // GET ALL USERS

  describe("getAllUsers", () => {
    it("✅ retourne tous les utilisateurs", async () => {
      User.find.mockResolvedValue([{ _id: "user1" }, { _id: "user2" }]);
      await userCtrl.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        users: [{ _id: "user1" }, { _id: "user2" }],
      });
    });

    it("❌ erreur serveur", async () => {
      User.find.mockRejectedValue(new Error("DB error"));
      await userCtrl.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // GET USER PROFILE

  describe("getUserProfile", () => {
    it("✅ retourne le profil utilisateur", async () => {
      getUser.mockReturnValue("user123");
      User.findById.mockResolvedValue({ _id: "user123", firstName: "John" });

      await userCtrl.getUserProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: { _id: "user123", firstName: "John" },
      });
    });

    it("❌ utilisateur non autorisé", async () => {
      getUser.mockReturnValue(-1);
      await userCtrl.getUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("❌ utilisateur introuvable", async () => {
      getUser.mockReturnValue("user123");
      User.findById.mockResolvedValue(null);
      await userCtrl.getUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("❌ erreur serveur", async () => {
      getUser.mockImplementation(() => {
        throw new Error("Token error");
      });
      await userCtrl.getUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
