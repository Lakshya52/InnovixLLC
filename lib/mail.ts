import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
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

export async function sendOrderKeysEmail(email: string, items: { productName: string, keys: string[] }[]) {
  const itemsHtml = items.map(item => `
    <div style="margin-bottom: 30px; padding: 20px; background-color: #1a1a1a; border-radius: 15px; border: 1px solid #ffffff05;">
      <h3 style="color: #6eDD86; margin-top: 0; font-size: 18px;">${item.productName}</h3>
      <p style="color: #aaa; font-size: 13px; margin-bottom: 15px;">License Keys (${item.keys.length}):</p>
      ${item.keys.map(key => `
        <div style="background-color: #000000; padding: 12px; border-radius: 8px; border: 1px dashed #6eDD86; text-align: center; margin-bottom: 10px;">
          <code style="color: #6eDD86; font-size: 16px; font-family: 'Courier New', monospace; font-weight: bold;">${key}</code>
        </div>
      `).join('')}
    </div>
  `).join('');

  const mailOptions = {
    from: `"InnovixLLC Fulfillment" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your License Keys from InnovixLLC`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0b0b0b; color: #ffffff; border-radius: 20px; border: 1px solid #ffffff10;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6eDD86; margin: 0; font-size: 28px;">InnovixLLC</h1>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Premium Digital Infrastructure</p>
        </div>
        
        <h2 style="text-align: center; font-size: 22px; margin-bottom: 30px;">Your Digital Assets are Ready</h2>
        
        ${itemsHtml}

        <div style="background-color: #1a1a1a; padding: 20px; border-radius: 15px; margin-top: 30px;">
          <p style="font-size: 13px; color: #888; margin-top: 0;"><strong>Activation Instructions:</strong></p>
          <ul style="font-size: 13px; color: #888; padding-left: 20px;">
            <li>Copy the license keys provided above.</li>
            <li>Use them in your respective applications to unlock premium features.</li>
            <li>Need help? Contact our support team via the dashboard.</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #6eDD86; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">View in Dashboard</a>
        </div>
        
        <p style="font-size: 11px; color: #444; text-align: center; margin-top: 40px;">
          InnovixLLC &copy; 2026. All rights reserved.<br />
          This is an automated delivery. Please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Order completion email error:", error);
    return { error: "Failed to send license keys email" };
  }
}

export async function sendOrderKeyEmail(email: string, productName: string, key: string) {
  return sendOrderKeysEmail(email, [{ productName, keys: [key] }]);
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

export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const mailOptions = {
    from: `"InnovixLLC Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Contact Form] ${subject} — from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0b0b0b; color: #ffffff; border-radius: 20px; border: 1px solid #ffffff10;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6eDD86; margin: 0; font-size: 28px;">InnovixLLC</h1>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">New Contact Form Submission</p>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 30px; border-radius: 15px; border: 1px solid #ffffff05;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ffffff08; color: #888; font-size: 13px; font-weight: 600; width: 120px; vertical-align: top;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ffffff08; color: #ffffff; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ffffff08; color: #888; font-size: 13px; font-weight: 600; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ffffff08; color: #6eDD86; font-size: 14px;"><a href="mailto:${email}" style="color: #6eDD86; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ffffff08; color: #888; font-size: 13px; font-weight: 600; vertical-align: top;">Subject</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ffffff08; color: #ffffff; font-size: 14px;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #ffffff; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${email}" style="background-color: #6eDD86; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Reply to ${name}</a>
        </div>
        
        <p style="font-size: 12px; color: #444; text-align: center; margin-top: 40px;">
          InnovixLLC &copy; 2026. All rights reserved.<br />
          This message was sent via the Contact Us form on your website.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Contact form email error:", error);
    return { error: "Failed to send contact email" };
  }
}
