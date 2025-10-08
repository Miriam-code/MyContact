import express from "express";
import usersCtrl from "../controllers/usersCtrl.js";
import {jwtUtils} from "../middlewares/jwtUtils.js"

const router = express.Router();


router.post("/register", usersCtrl.register);
router.post("/auth", usersCtrl.auth);
router.put("/:id", usersCtrl.updateUser);
router.delete("/:id", jwtUtils, usersCtrl.deleteUser);
router.get("/get-all", jwtUtils, usersCtrl.getAllUsers);
router.get("/me", jwtUtils, usersCtrl.getUserProfile);

export default router;


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (authentification + profil)
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Users]
 */

/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: Authentifie un utilisateur existant
 *     tags: [Users]
 */


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /users/get-all:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupère le profil de l’utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur retourné
 *       401:
 *         description: Token manquant ou invalide
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré par MongoDB
 *           example: "66f234c9b6e9a34d0f1a5a7e"
 *         firstName:
 *           type: string
 *           description: Prénom de l'utilisateur
 *           example: "Miriam"
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'utilisateur
 *           example: "Doe"
 *         phone:
 *           type: string
 *           description: Numéro de téléphone (10 à 20 caractères)
 *           example: "+33612345678"
 *         email:
 *           type: string
 *           description: Adresse email unique de l'utilisateur
 *           example: "miriam.doe@example.com"
 *         password:
 *           type: string
 *           description: Mot de passe chiffré de l'utilisateur
 *           example: "$2b$10$Q9lFjJ0vPn6G0T3bHY1bWu8qhzvKkOQYHqU6gD1sZyJvN9Pvqk2iq"
 *         is_admin:
 *           type: boolean
 *           description: Indique si l'utilisateur est administrateur
 *           default: false
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du compte
 *           example: "2025-10-06T08:45:12.678Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour du compte
 *           example: "2025-10-06T10:12:45.123Z"
 */


