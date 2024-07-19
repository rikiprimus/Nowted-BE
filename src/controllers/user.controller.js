import User from "../models/user.model.js";

const UserController = {
  getAll: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json({ message: "Data berhasil didapatkan", data: user });
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar user" });
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        res.status(401).json({ message: "Data tidak ditemukan" });
      }
      res.status(200).json({ message: "Data berhasil didapatkan", data: user });
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar user" });
    }
  },
  create: async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
      //checking input data
      if (name === "" || email === "" || password === "") {
        return res.status(401).json({ message: "Data harus terisi semua" });
      }
      const newUser = new User({ name, email, password });
      const savedUser = await newUser.save();
      //checking save data
      if (!savedUser) {
        return res
          .status(400)
          .json({ message: "Gagal menyimpan data pengguna" });
      }

      res
        .status(201)
        .json({ message: "Data berhasil dibuat", data: savedUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat membuat user baru" });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, password },
        { new: true }
      );
      //checking update data
      if (!updatedUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res
        .status(201)
        .json({ message: "Data berhasil di update", data: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan update" });
    }
  },
  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res
        .status(201)
        .json({ message: "Data berhasil dihapus", data: deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan delete" });
    }
  },
  getRecentNotes: async (req, res) => {
    try {
      const { user_id } = req.params;
      const user = await User.findById(user_id).populate({
        path: 'recentNotes.note_id',
        match: { trash: false }
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const recentNotes = user.recentNotes.filter(note => note.note_id);
  
      res.status(200).json(recentNotes);
    } catch (error) {
      console.error("Error fetching recent notes:", error);
      res.status(500).json({ message: error.message });
    }
  },
  addRecentNote: async (user_id, note_id) => {
    const user = await User.findById(user_id);
    if (user) {
      user.recentNotes = user.recentNotes.filter(
        (note) => note.note_id.toString() !== note_id.toString()
      );

      user.recentNotes.unshift({ note_id, openedAt: new Date() });

      if (user.recentNotes.length > 3) {
        user.recentNotes.pop();
      }

      await user.save();
    }
  },
};

export default UserController;
