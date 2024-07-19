import User from "../models/user.model.js";
import { sendOTP, sendForgot } from "../helper/email.js";
import crypto from 'crypto';
import argon2 from 'argon2';
import generateToken from "../helper/token.js";
import validatePassword from "../helper/validatePassword.js";

const AuthController = {
  register: async (req, res, next) => {
    const { name, email, password } = req.body;

    if(!validatePassword(password)) {
      return res.status(400).json({ message: 'password minimal harus 8 huruf dan mengandung angka, huruf besar, huruf kecil dan simbol'})
    }
    try {
      if(name === '' || email === '' || password === ''){
        return res.status(400).json({ message: 'Masukan semua data input' })
      }

      const existingUser = await User.findOne({ email })
      if(existingUser) {
        return res.status(400).json({ message: 'Email sudah digunakan'})
      }

      const otp = crypto.randomBytes(3).toString('hex');
      const sendWithEmail = await sendOTP(email, otp, name)
      if (!sendWithEmail) {
        return res.status(400).json({ message: 'Gagal mengirim email' });
      }

      const newUser = new User({ name, email, password, otp });
      const savedUser = await newUser.save();
      if (!savedUser) {
        return res.status(400).json({ message: 'Email gagal di daftarkan' });
      }

      res.status(201).json({ message: 'Email berhasil didaftarkan', data: savedUser})
    } catch (error) {
      console.error('Error register:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat registrasi'})
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email tidak terdaftar' });
      }

      if (user.verify === false) {
        return res.status(400).json({ message: 'Email belum terverifikasi, cek email terlebih dahulu'})
      }

      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password salah' });
      }
      const userObject = user.toObject();
      const token = generateToken(userObject);
      user.token = token;
      res.status(200).json({ message: 'Login berhasil', data: user, token });
    } catch (error) {
      console.error('Error login:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat melakukan login'})
    }
  },

  verifyotp: async (req, res, next) => {
    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email })

      if(!user || user.otp !== otp){
        return res.status(400).json({message: 'Verifikasi otp gagal'})
      }

      user.verify = true;
      user.otp = '';
      await user.save();

      res.status(201).json({ message: 'Verifikasi berhasil', data: user})
    } catch (error) {
      console.error('Error verify otp:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat melakukan verifikasi otp'})
    }
  },
  forgotpassword: async (req, res, next) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email tidak terdaftar' });
      }
      
      if (user.verify === false) {
        return res.status(400).json({ message: 'Email belum terverifikasi, cek email terlebih dahulu'})
      }

      const otp = crypto.randomBytes(3).toString('hex');
      user.otp = otp;
      await user.save();
      const sendCode = await sendForgot(email, otp)
      if (!sendCode) {
        return res.status(400).json({ message: 'Gagal mengirim email' });
      }

      res.status(201).json({ message: 'Permintaan lupa password berhasil, check your email', data: user})
    } catch (error) {
      console.error('Error request forgot password:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat melakukan forgot password'})
    }
  },
  newpassword: async (req, res, next) => {
    const { email, password } = req.body;
    if(!validatePassword(password)) {
      return res.status(400).json({ message: 'password minimal harus 8 huruf dan mengandung angka, huruf besar, huruf kecil dan simbol'})
    }
    try {
      const user = await User.findOne({ email })
      if(!user) {
        return res.status(400).json({ message: 'email tidak terdaftar'})
      }
      
      user.password = password;
      const userSaved = await user.save();
      if(!userSaved) {
        res.status(400).json({ message: 'Gagal menyimpan password baru'})
      }

      res.status(201).json({ message: 'Password berhasil di ganti'})
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat melakukan ganti password'})
    }
  },
}

export default AuthController;