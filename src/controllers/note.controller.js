import Note from "../models/note.model.js";
import UserController from "./user.controller.js";

const NoteController = {
  getAll: async (req, res) => {
    try {
      const note = await Note.find().sort({ createdAt: -1 });
      res.status(200).json({ message: "Data berhasil didapatkan", data: note });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar note" });
    }
  },
  getById: async (req, res) => {
    const { id, user_id } = req.params;

    try {
      // Find the note by id and ensure it's not in trash
      const note = await Note.findOne({ _id: id, trash: { $ne: true } });
      if (!note) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      await UserController.addRecentNote(user_id, id);

      res.status(200).json({ message: "Data berhasil didapatkan", data: note });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar note" });
    }
  },
  getByUser: async (req, res) => {
    const { user_id } = req.params;

    try {
      const note = await Note.find({ user_id: user_id });
      if (note.length === 0) {
        return res.status(401).json({ message: "Data tidak ditemukan" });
      }
      res.status(200).json({ message: "Data berhasil didapatkan", data: note });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar note" });
    }
  },
  getByFolder: async (req, res) => {
    const { folder_id } = req.params;

    try {
      const note = await Note.find({ folder_id: folder_id });
      if (note.length === 0) {
        return res.status(401).json({ message: "Data tidak ditemukan" });
      }
      res.status(200).json({ message: "Data berhasil didapatkan", data: note });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar note" });
    }
  },
  getByUserAndFolder: async (req, res) => {
    const { user_id, folder_id } = req.params;

    if (!user_id || !folder_id) {
      return res
        .status(400)
        .json({ message: "user_id dan folder_id diperlukan" });
    }

    try {
      const notes = await Note.find({
        user_id: user_id,
        folder_id: folder_id,
        trash: { $ne: true },
      });

      if (notes.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res
        .status(200)
        .json({ message: "Data berhasil didapatkan", data: notes });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar note" });
    }
  },
  getByUserWithFilter: async (req, res) => {
    const { user_id } = req.params;
    const { filter } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "user_id diperlukan" });
    }

    let query = { user_id: user_id, trash: { $ne: true } };

    if (filter === "favorite") {
      query.favorite = true;
    } else if (filter === "trash") {
      query.trash = true;
    } else if (filter === "archived") {
      query.archived = true;
    } else {
      return res.status(404).json({ message: "Tidak ada filter" });
    }

    try {
      const notes = await Note.find(query);

      if (notes.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res
        .status(200)
        .json({ message: "Data berhasil didapatkan", data: notes });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar note" });
    }
  },
  create: async (req, res, next) => {
    const { user_id } = req.body;
    let prefix = 'note-'

    try {

      const notes = await Note.find({ title: { $regex: `^${prefix}`, $options: 'i' } });
      const count = notes.length;
      const title = `${prefix}${count + 1}`;
      
      //checking input data
      if (user_id === "") {
        return res.status(401).json({ message: "Data User harus terisi" });
      }
      const newNote = new Note({
        title,
        user_id,
      });
      const savedNote = await newNote.save();
      //checking save data
      if (!savedNote) {
        return res.status(400).json({ message: "Gagal menyimpan data note" });
      }

      await UserController.addRecentNote(user_id, savedNote._id);

      res
        .status(201)
        .json({ message: "Data berhasil dibuat", data: savedNote });
    } catch (error) {
      console.error("Error creating note:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat membuat note baru" });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const {
      title,
      content,
      date,
      archived,
      trash,
      favorite,
      user_id,
      folder_id,
    } = req.body;

    try {
      const updatedNote = await Note.findByIdAndUpdate(
        { _id: id },
        { title, content, date, archived, trash, favorite, user_id, folder_id },
        { new: true }
      );
      //checking update data
      if (!updatedNote) {
        return res.status(404).json({ message: "Note tidak ditemukan" });
      }

      res
        .status(201)
        .json({ message: "Data berhasil di update", data: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan update" });
    }
  },
  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const deletedNote = await Note.findByIdAndDelete(id);

      if (!deletedNote) {
        return res.status(404).json({ message: "Note tidak ditemukan" });
      }

      res
        .status(201)
        .json({ message: "Data berhasil dihapus", data: deletedNote });
    } catch (error) {
      console.error("Error deleting note:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan delete" });
    }
  },
};

export default NoteController;
