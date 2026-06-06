import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, message } = req.body;

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.GMAIL_USER || 'nexa.8000@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD || ''
      }
  });

  try {
      await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.GMAIL_USER || 'nexa.8000@gmail.com'}>`,
          to: 'nexa.8000@gmail.com',
          subject: `Portfolio Contact from ${username}`,
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #1a1a2e; color: #fff; padding: 30px; border-radius: 12px;">
                  <h2 style="color: #b200ff; border-bottom: 1px solid #333; padding-bottom: 10px;">New Contact Message</h2>
                  <p><strong style="color: #8a2be2;">Name:</strong> ${username}</p>
                  <p><strong style="color: #8a2be2;">Email:</strong> ${email}</p>
                  <p><strong style="color: #8a2be2;">Message:</strong></p>
                  <div style="background: rgba(138,43,226,0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #b200ff;">
                      ${message}
                  </div>
                  <p style="color: #666; margin-top: 20px; font-size: 12px;">Sent from Obito Portfolio</p>
              </div>
          `
      });
      
      console.log(`Email sent successfully from ${username} (${email})`);
      res.status(200).json({ success: true, message: 'Message sent successfully to Obito!' });
  } catch (error) {
      console.error('Email sending failed:', error.message);
      res.status(200).json({ success: true, message: 'Message received!' });
  }
}
