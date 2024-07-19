import express from "express";
const router = express.Router();
import NoteController from "../controllers/note.controller.js";
import protect from "../middleware/protect.js";

router.get('/', protect, NoteController.getAll)
router.post('/create', protect, NoteController.create)

export default router