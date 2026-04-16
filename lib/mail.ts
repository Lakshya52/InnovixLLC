import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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

export async function sendOrderKeyEmail(email: string, productName: string, key: string) {
  const mailOptions = {
    from: `"InnovixLLC Fulfillment" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your License Key for ${productName} - InnovixLLC`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0b0b0b; color: #ffffff; border-radius: 20px; border: 1px solid #ffffff10;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6eDD86; margin: 0; font-size: 28px;">InnovixLLC</h1>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Premium Digital Infrastructure</p>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 30px; border-radius: 15px; border: 1px solid #ffffff05;">
          <h2 style="margin-top: 0; font-size: 20px; font-weight: 600;">Delivery info for ${productName}</h2>
          <p style="color: #aaa; font-size: 14px; line-height: 1.6;">Your digital license key has been generated successfully. Please find it below:</p>
          
          <div style="background-color: #000000; padding: 15px; border-radius: 10px; border: 1px dashed #6eDD86; text-align: center; margin: 25px 0;">
            <code style="color: #6eDD86; font-size: 20px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 2px;">${key}</code>
          </div>
          
          <div style="margin-top: 20px;">
            <p style="font-size: 13px; color: #888;"><strong>Activation Instructions:</strong></p>
            <ol style="font-size: 13px; color: #888; padding-left: 20px;">
              <li>Copy the license key above.</li>
              <li>Open your application and navigate to the activation settings.</li>
              <li>Paste the key and follow the on-screen prompts.</li>
            </ol>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #6eDD86; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Access Dashboard</a>
        </div>
        
        <p style="font-size: 12px; color: #444; text-align: center; margin-top: 40px;">
          InnovixLLC &copy; 2026. All rights reserved.<br />
          This is an automated delivery. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Order completion email error:", error);
    return { error: "Failed to send license key email" };
  }
}

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"InnovixLLC Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code - InnovixLLC",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0b0b0b; color: #ffffff; border-radius: 20px; border: 1px solid #ffffff10;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6eDD86; margin: 0; font-size: 28px;">InnovixLLC</h1>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Security Verification</p>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 30px; border-radius: 15px; border: 1px solid #ffffff05; text-align: center;">
          <h2 style="margin-top: 0; font-size: 20px; font-weight: 600;">Verification Code</h2>
          <p style="color: #aaa; font-size: 14px; line-height: 1.6;">Use the following code to verify your identity. This code will expire in 10 minutes.</p>
          
          <div style="background-color: #000000; padding: 20px; border-radius: 10px; border: 1px dashed #6eDD86; display: inline-block; margin: 25px 0;">
            <span style="color: #6eDD86; font-size: 32px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="font-size: 13px; color: #888;">If you did not request this code, please ignore this email or contact support if you suspect unauthorized access.</p>
        </div>

        <p style="font-size: 12px; color: #444; text-align: center; margin-top: 40px;">
          InnovixLLC &copy; 2026. All rights reserved.<br />
          This is an automated security message. Please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("OTP email error:", error);
    return { error: "Failed to send verification email" };
  }
}

