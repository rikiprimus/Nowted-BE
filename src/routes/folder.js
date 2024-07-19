import express from "express";
const router = express.Router();
import FolderController from "../controllers/folder.controller.js";
import protect from "../middleware/protect.js";

router.get('/', protect,  FolderController.getAll)
router.get('/:id', protect, FolderController.getById)
router.get('/user/:user_id', protect, FolderController.getByUser)
router.post('/create', protect, FolderController.create)
router.put('/:id', protect, FolderController.update)
router.delete('/:id', protect, FolderController.delete)

export default router