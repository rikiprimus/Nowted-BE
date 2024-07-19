import express from "express";
const router = express.Router();
import UserController from '../controllers/user.controller.js';
import protect from "../middleware/protect.js";

router.get('/', protect, UserController.getAll)
router.get('/:id', protect, UserController.getById)
router.post('/create', protect, UserController.create)
router.put('/:id', protect, UserController.update)
router.delete('/:id', protect, UserController.delete)
router.get('/recent/:user_id', protect, UserController.getRecentNotes)

export default router