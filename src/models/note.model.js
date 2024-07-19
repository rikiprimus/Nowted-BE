import mongoose from "mongoose";
const { Schema } = mongoose;

const noteSchema = new Schema({
  _id: { 
    type: Schema.Types.ObjectId, 
    auto: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String,
    default: ''
  },
  date: { 
    type: Date,
    default: new Date()
  },
  archived: { 
    type: Boolean, 
    default: false 
  },
  trash: { 
    type: Boolean, 
    default: false 
  },
  favorite: { 
    type: Boolean, 
    default: false 
  },
  user_id: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  folder_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Folder',
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
})

const Note = mongoose.model('Note', noteSchema);

export default Note;