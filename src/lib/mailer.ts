import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"VaxCare" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your VaxCare Verification Code",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f6f8ff;border-radius:16px;">
        <h2 style="color:#4f46e5;margin-bottom:8px;">VaxCare Verification</h2>
        <p style="color:#3d4663;">Use the code below to verify your account. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:800;letter-spacing:12px;color:#0a0e1a;background:#fff;border:2px solid #e0e4f5;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
          ${otp}
        </div>
        <p style="color:#8896b3;font-size:13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}
