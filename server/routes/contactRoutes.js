import express from "express";
import contactsCtrl from "../controllers/contactCtrl.js";
import { jwtUtils } from "../middlewares/jwtUtils.js";
const router = express.Router();


router.get("/all",jwtUtils, contactsCtrl.getContacts);
// router.get("/:id", contactsCtrl.getOneContact);
router.post("/", jwtUtils, contactsCtrl.createContact);
router.put("/:id",jwtUtils, contactsCtrl.updateContact);
router.delete("/:id",jwtUtils, contactsCtrl.deleteContact);

export default router;


/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupère tous les contacts de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crée un nouveau contact pour l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "0601020304"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Contact créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Champs manquants, numéro invalide ou doublon
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Met à jour un contact existant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du contact à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "0601020304"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Contact mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Numéro invalide ou doublon
 *       404:
 *         description: Contact non trouvé
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprime un contact existant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du contact à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact supprimé
 *       404:
 *         description: Contact non trouvé
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f0a5e1b3f2a9c123456789
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: "0601020304"
 *         image:
 *           type: string
 *           example: "image_1696567890123.jpg"
 *         user:
 *           type: string
 *           example: 64f0a5d9b3f2a9c123456788
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-06T12:34:56.789Z
 */

