const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars, no spaces)
  },
});

async function sendContactNotification({ name, email, subject, body }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return; // silently skip if not configured

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New message from ${name}: ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px">
        <h2 style="margin:0 0 20px;font-size:18px;color:#111">New contact form submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:600;width:90px;color:#555;font-size:13px">Name</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-size:14px;color:#111">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:600;color:#555;font-size:13px">Email</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-size:14px"><a href="mailto:${email}" style="color:#7C3AED">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:600;color:#555;font-size:13px">Subject</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-size:14px;color:#111">${subject}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:600;color:#555;font-size:13px;vertical-align:top">Message</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e5e5e5;font-size:14px;color:#111;white-space:pre-line">${body}</td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#999">Hit reply to respond directly to ${name}.</p>
      </div>
    `,
  });
}

module.exports = { sendContactNotification };
