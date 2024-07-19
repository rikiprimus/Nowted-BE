import mongoose from "mongoose";
const { Schema } = mongoose;

const folderSchema = new Schema({
  _id: { 
    type: Schema.Types.ObjectId, 
    auto: true 
  },
  name: { 
    type: String, 
    required: true
  },
  user_id: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
})

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;