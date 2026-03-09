const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

/**
 * Send a verification email with a 6-digit code.
 * @param {string} toEmail  - recipient address
 * @param {string} name     - recipient's name
 * @param {string} code     - 6-digit verification code
 */
const sendVerificationEmail = async (toEmail, name, code) => {
  const mailOptions = {
    from: '"Flight Booking System" <no-reply@flightbooking.dev>',
    to: toEmail,
    subject: 'Verify Your Email Address',
    text: `Hi ${name},\n\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you did not create an account, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Verify Your Email</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2980b9;">${code}</span>
        </div>
        <p style="color: #7f8c8d; font-size: 13px;">If you did not create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
