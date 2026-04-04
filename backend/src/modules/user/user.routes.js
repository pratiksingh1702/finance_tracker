'use strict';

const router     = require('express').Router();
const controller = require('./user.controller');
const { validateCreateUser, validateUpdateUser, validateAssignRole } = require('./user.validator');
const { canReadUser, canCreateUser, canUpdateUser, canDeleteUser }   = require('./user.policy');
const authenticate = require('../../middlewares/authenticate.middleware');
const auditLog     = require('../../middlewares/audit-log.middleware');

// All user routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/',          canReadUser,   controller.list);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/:id',       canReadUser,   controller.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/',         canCreateUser, validateCreateUser, auditLog('CREATE_USER','User'),     controller.create);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/:id',     canUpdateUser, validateUpdateUser, auditLog('UPDATE_USER','User'),     controller.update);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Assign role to user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *     responses:
 *       200:
 *         description: Role assigned
 */
router.patch('/:id/role',canUpdateUser, validateAssignRole, auditLog('ASSIGN_ROLE','User'),     controller.assignRole);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.patch('/:id/deactivate', canUpdateUser, auditLog('DEACTIVATE_USER','User'),              controller.deactivate);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id',    canDeleteUser, auditLog('DELETE_USER','User'),                         controller.remove);

module.exports = router;
