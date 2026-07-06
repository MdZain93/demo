import nodemailer from 'nodemailer';

export async function handler(event, context) {
  // Handle CORS preflight options request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const { to, toName, subject, body } = JSON.parse(event.body || '{}');

    if (!to || !subject || !body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: false, error: 'Missing required fields: to, subject, body' }),
      };
    }

    const GMAIL_USER = process.env.GMAIL_USER || 'mohammedshehriyaarf4@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_APP_PASSWORD) {
      console.error('❌ GMAIL_APP_PASSWORD is not set in Netlify environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'GMAIL_APP_PASSWORD is not configured on Netlify. Please add it to your site environment variables.' 
        }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"e-GRCP Platform" <${GMAIL_USER}>`,
      to: toName ? `"${toName}" <${to}>` : to,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br/>'),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} | MessageId: ${info.messageId}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        messageId: info.messageId,
      }),
    };
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
