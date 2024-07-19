import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "da28fe3b786e37",
    pass: "f6b2be6034b7d5"
  }
});

async function sendMail(mailOptions){
  try{
    const data = await transporter.sendMail(mailOptions)
    console.log("email sent : ",data.response ?? data)
    return data.response
  } catch(err){
    console.log("email error : ", err.message ?? err)
    return false
  }
};

const sendOTP = async (email_user, otp, name) => {
  const mailOption = {
    from: '@nowted.com',
		to: email_user,
		subject: `Hello ${name}, Please Verification with this link`,
		text: `Hello ${name}, Please Verification for Nowted App, this is your code : ${otp}`
	}
	return await sendMail(mailOption)
}

const sendForgot = async (email_user, otp) => {
  const mailOption = {
    from: '@nowted.com',
		to: email_user,
		subject: `Hello ${email_user}, Please input your code for change your password`,
		text: `Hello ${email_user}, Please input your code for change your password, this is your code : ${otp}`
	}
	return await sendMail(mailOption)
}


export {sendOTP, sendForgot};