import Folder from "../models/folder.model.js";

const FolderController = {
  getAll: async (req, res) => {
    try {
      const folder = await Folder.find().sort({ createdAt: -1 });
      res
        .status(200)
        .json({ message: "Folder berhasil didapatkan", data: folder });
    } catch (error) {
      console.error("Error fetching folders:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar folder" });
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const folder = await Folder.findById(id);
      if (!folder) {
        res.status(401).json({ message: "Folder tidak ditemukan" });
      }
      res
        .status(200)
        .json({ message: "Folder berhasil didapatkan", data: folder });
    } catch (error) {
      console.error("Error fetching folders:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar folder" });
    }
  },
  getByUser: async (req, res) => {
    const { user_id } = req.params;

    try {
      const folder = await Folder.find({ user_id: user_id });
      console.log(folder)
      if (folder.length === 0) {
        res.status(401).json({ message: "Folder tidak ditemukan" });
      }
      res
        .status(200)
        .json({ message: "Folder berhasil didapatkan", data: folder });
    } catch (error) {
      console.error("Error fetching folders:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mengambil daftar folder dari user id" });
    }
  },
  create: async (req, res, next) => {
    let name;
    let folderNumber = 1;
    let folderExists = true;
    const { user_id } = req.body

    try {
      const existingFoldersCount = await Folder.countDocuments();
      if (existingFoldersCount >= 5) {
        return res
          .status(400)
          .json({ message: "Maksimum 5 folder sudah tercapai" });
      }
      while (folderExists) {
        name = `folder${folderNumber}`;
        const existingFolder = await Folder.findOne({ name });

        if (!existingFolder) {
          folderExists = false;
        } else {
          folderNumber++;
        }
      }

      if (user_id === "") {
        return res.status(401).json({ message: "Data User harus terisi" });
      }

      const newFolder = new Folder({ name, user_id });
      const savedFolder = await newFolder.save();

      if (!savedFolder) {
        return res.status(400).json({ message: "Gagal menyimpan folder baru" });
      }

      res
        .status(201)
        .json({ message: "Folder berhasil dibuat", data: savedFolder });
    } catch (error) {
      console.error("Error creating folder:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat membuat folder baru" });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, user_id } = req.body;

    try {
      const updatedFolder = await Folder.findByIdAndUpdate(
        id,
        { name, user_id },
        { new: true }
      );
      //checking update data
      if (!updatedFolder) {
        return res.status(404).json({ message: "Folder tidak ditemukan" });
      }

      res
        .status(201)
        .json({ message: "Folder berhasil di update", data: updatedFolder });
    } catch (error) {
      console.error("Error updating folder:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan update" });
    }
  },
  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const deletedFolder = await Folder.findByIdAndDelete(id);

      if (!deletedFolder) {
        return res.status(404).json({ message: "Folder tidak ditemukan" });
      }

      res
        .status(201)
        .json({ message: "Folder berhasil dihapus", data: deletedFolder });
    } catch (error) {
      console.error("Error deleting folder:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan delete" });
    }
  },
};

export default FolderController;
