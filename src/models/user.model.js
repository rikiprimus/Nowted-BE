import mongoose from "mongoose";
import argon2 from "argon2";
import { Schema } from "mongoose";

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId, 
    auto: true 
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  google_id: {
    type: String,
  },
  otp: {
    type: String,
  },
  verifyotp: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  recentNotes: [{
    note_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    openedAt: { type: Date, default: Date.now }
  }]
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

export default User;