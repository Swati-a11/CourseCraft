import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,                  // Secure port for SSL
  secure: true,               // True for port 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Bypasses self-signed certificate blocks on cloud containers
  },
  dnsOptions: {
    family: 4 // FORCES NODEMAILER TO USE IPV4 ONLY (Bypasses ENETUNREACH IPv6 block)
  },
  connectionTimeout: 10000,    // 10 seconds timeout limit
  greetingTimeout: 10000
});

export const sendSystemNotification = async (toEmail, subject, textBody) => {
  console.log(`📡 SMTP Target Request Log: Attempting to mail -> ${toEmail}`);
  try {
    const mailOptions = {
      from: `"CourseCraft" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: textBody
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("🔥 NODEMAILER SYSTEM CRITICAL LOG: SUCCESS DISPATCHED -> ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("🚨 NODEMAILER SYSTEM CRITICAL LOG: ACTUAL SMTP FAILURE DETAILED:", error.message);
    throw error;
  }
};

export const sendContinuityReminder = async (toEmail, username, currentStreak) => {
  const subject = "CourseCraft Continuity Subscription Active 🚀";
  const body = `Hello ${username || 'Student'}!\n\nYou have successfully registered this email address for CourseCraft learning continuity alerts.\n\nYour current streak is ${currentStreak || 0} days. We will keep you updated on your streak milestones and active course progress metrics to maintain your momentum!\n\nKeep Learning!\nTeam CourseCraft`;
  return sendSystemNotification(toEmail, subject, body);
};
