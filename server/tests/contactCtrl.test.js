import contactsCtrl from "../controllers/contactCtrl.js";
import Contact from "../models/Contact.js";
import validator from "validator";

jest.mock("../models/Contact.js");
jest.mock("validator");

describe("contacts Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: { firstName: "John", lastName: "Doe", phone: "0601020304" },
      params: { id: "contact123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // =====================================================
  // 🔹 TESTS GET CONTACTS
  // =====================================================
  describe("getContacts", () => {
    it("✅ retourne les contacts de l'utilisateur", async () => {
      const mockContacts = [{ firstName: "John" }, { firstName: "Jane" }];
      Contact.find.mockResolvedValue(mockContacts);

      await contactsCtrl.getContacts(req, res);

      expect(Contact.find).toHaveBeenCalledWith({ user: "user123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ contacts: mockContacts });
    });

    it("❌ gère une erreur serveur", async () => {
      Contact.find.mockRejectedValue(new Error("Erreur DB"));

      await contactsCtrl.getContacts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Erreur serveur" })
      );
    });
  });

  // =====================================================
  // 🔹 TESTS CREATE CONTACT
  // =====================================================
  describe("createContact", () => {
    it("✅ crée un nouveau contact", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      Contact.findOne.mockResolvedValue(null);
      Contact.prototype.save = jest.fn().mockResolvedValue();

      await contactsCtrl.createContact(req, res);

      expect(validator.isMobilePhone).toHaveBeenCalledWith("0601020304", "fr-FR");
      expect(Contact.findOne).toHaveBeenCalledWith({
        phone: "0601020304",
        user: "user123",
      });
      expect(Contact.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Contact créé",
          contact: expect.any(Object),
        })
      );
    });

    it("❌ renvoie 400 si un champ est manquant", async () => {
      req.body = { firstName: "John" };

      await contactsCtrl.createContact(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tous les champs sont requis",
      });
    });

    it("❌ renvoie 400 si le téléphone est invalide", async () => {
      validator.isMobilePhone.mockReturnValue(false);

      await contactsCtrl.createContact(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Numéro de téléphone invalide",
      });
    });

    it("❌ renvoie 400 si le contact existe déjà", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      Contact.findOne.mockResolvedValue({ _id: "existing" });

      await contactsCtrl.createContact(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact existe déjà",
      });
    });

    it("❌ gère une erreur serveur", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      Contact.findOne.mockResolvedValue(null);
      Contact.prototype.save = jest.fn().mockRejectedValue(new Error("DB error"));

      await contactsCtrl.createContact(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Erreur serveur" })
      );
    });
  });

  // =====================================================
  // 🔹 TESTS UPDATE CONTACT
  // =====================================================
  describe("updateContact", () => {
    it("✅ met à jour un contact", async () => {
      validator.isMobilePhone.mockReturnValue(true);

      const mockContact = {
        _id: "contact123",
        user: "user123",
        firstName: "John",
        lastName: "Doe",
        phone: "0601020304",
        save: jest.fn(),
      };

      Contact.findOne
        .mockResolvedValueOnce(mockContact) // premier findOne pour trouver le contact
        .mockResolvedValueOnce(null); // deuxième findOne pour vérifier doublon

      req.body = { firstName: "Johnny", phone: "0605060607" };

      await contactsCtrl.updateContact(req, res);

      expect(Contact.findOne).toHaveBeenCalledWith({ _id: "contact123", user: "user123" });
      expect(mockContact.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Contact mis à jour",
          contact: expect.any(Object),
        })
      );
    });

    it("❌ renvoie 400 si le téléphone est invalide", async () => {
      validator.isMobilePhone.mockReturnValue(false);
      req.body = { phone: "123" };

      await contactsCtrl.updateContact(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Numéro de téléphone invalide",
      });
    });

    it("❌ renvoie 404 si le contact n'existe pas", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      Contact.findOne.mockResolvedValue(null);

      await contactsCtrl.updateContact(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contact non trouvé",
      });
    });

    it("❌ renvoie 400 si doublon de téléphone", async () => {
      validator.isMobilePhone.mockReturnValue(true);
      const existingContact = { _id: "otherContact" };
      const contact = {
        _id: "contact123",
        user: "user123",
        phone: "0601020304",
        save: jest.fn(),
      };

      Contact.findOne
        .mockResolvedValueOnce(contact) // pour trouver le contact
        .mockResolvedValueOnce(existingContact); // pour vérifier doublon

      req.body = { phone: "0601020305" };

      await contactsCtrl.updateContact(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Un contact avec ce numéro existe déjà",
      });
    });

    it("❌ gère une erreur serveur", async () => {
      Contact.findOne.mockRejectedValue(new Error("DB error"));

      await contactsCtrl.updateContact(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Erreur serveur" })
      );
    });
  });

  // =====================================================
  // 🔹 TESTS DELETE CONTACT
  // =====================================================
  describe("deleteContact", () => {
    it("✅ supprime un contact", async () => {
      Contact.findOneAndDelete.mockResolvedValue({ _id: "contact123" });

      await contactsCtrl.deleteContact(req, res);

      expect(Contact.findOneAndDelete).toHaveBeenCalledWith({
        _id: "contact123",
        user: "user123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Contact supprimé" });
    });

    it("❌ renvoie 404 si le contact n'existe pas", async () => {
      Contact.findOneAndDelete.mockResolvedValue(null);

      await contactsCtrl.deleteContact(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Contact non trouvé" });
    });

    it("❌ gère une erreur serveur", async () => {
      Contact.findOneAndDelete.mockRejectedValue(new Error("DB error"));

      await contactsCtrl.deleteContact(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Erreur serveur" })
      );
    });
  });
});
