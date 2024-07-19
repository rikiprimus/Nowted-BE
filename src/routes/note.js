import express from "express";
const router = express.Router();
import NoteController from "../controllers/note.controller.js";
import protect from "../middleware/protect.js";

router.get('/', NoteController.getAll)
router.get('/:id/:user_id', protect, NoteController.getById)
router.get('/user/:user_id', protect, NoteController.getByUser)
router.get('/user/:user_id/:folder_id', protect, NoteController.getByUserAndFolder)
router.get('/:user_id', protect, NoteController.getByUserWithFilter)
router.get('/folder/:folder_id', protect, NoteController.getByFolder)
router.post('/create', protect, NoteController.create)
router.put('/:id', protect, NoteController.update)
router.delete('/:id', protect, NoteController.delete)

export default router