import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to your provider (e.g., 'resend', 'smtp.mailtrap.io', etc.)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password for Gmail
  },
});

export async function sendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${token}`;

  const mailOptions = {
    from: `"InnovixLLC" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password - InnovixLLC",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2; border-radius: 10px;">
        <h2 style="color: #6eDD86;">InnovixLLC</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your InnovixLLC account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #6eDD86; color: #131313; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">
          If the button above doesn't work, copy and paste this link into your browser: <br />
          <a href="${resetLink}">${resetLink}</a>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { error: "Failed to send email" };
  }
}
