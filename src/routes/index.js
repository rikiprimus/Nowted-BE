import express from 'express';
const router = express.Router();
import auth from './auth.js'
import user from './user.js';
import note from './note.js';
import folder from './folder.js';

//information
router.get("/", (req, res) => {
  res.send("This is route api !");
});

router.use("/auth", auth);
router.use("/note", note);
router.use("/folder", folder);
router.use("/user", user);

export default router;