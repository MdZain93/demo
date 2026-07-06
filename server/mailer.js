/**
 * e-GRCP Platform — Backend Email Service
 * 
 * Sends real emails via Gmail SMTP using Nodemailer.
 * Runs on port 3001, proxied by Vite dev server.
 */

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gmail SMTP Configuration
const GMAIL_USER = process.env.GMAIL_USER || 'mohammedshehriyaarf4@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// Verify SMTP connection on startup
transporter.verify()
  .then(() => console.log('✅ Gmail SMTP connected successfully as:', GMAIL_USER))
  .catch((err) => console.error('❌ Gmail SMTP connection failed:', err.message));

/**
 * POST /api/send-email
 * Body: { to, toName, subject, body }
 */
app.post('/api/send-email', async (req, res) => {
  const { to, toName, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ success: false, error: 'Missing required fields: to, subject, body' });
  }

  if (!GMAIL_APP_PASSWORD) {
    console.error('❌ GMAIL_APP_PASSWORD not set in .env');
    return res.status(500).json({ 
      success: false, 
      error: 'GMAIL_APP_PASSWORD is not configured. Please add it to your .env file.' 
    });
  }

  try {
    const mailOptions = {
      from: `"e-GRCP Platform" <${GMAIL_USER}>`,
      to: toName ? `"${toName}" <${to}>` : to,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br/>'),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} | MessageId: ${info.messageId}`);

    return res.json({ 
      success: true, 
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', smtp: GMAIL_USER, timestamp: new Date().toISOString() });
});

const PORT = process.env.MAILER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 e-GRCP Mailer Service running on http://localhost:${PORT}`);
  console.log(`   SMTP Account: ${GMAIL_USER}`);
  console.log(`   App Password: ${GMAIL_APP_PASSWORD ? '●●●●●●●● (configured)' : '⚠️  NOT SET — add GMAIL_APP_PASSWORD to .env'}\n`);
});
