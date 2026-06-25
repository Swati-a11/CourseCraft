import axios from 'axios';

export const sendSystemNotification = async (toEmail, subject, textBody) => {
  // Trim any accidental spaces from the environment variable
  const apiKey = (process.env.RESEND_API_KEY || 're_MyGBZWuC_6kXfhDVHgU7pyi74yVQFqz56').trim();
  
  console.log(`📡 REST API Request Log: Forwarding HTTP payload to -> ${toEmail}`);
  
  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'CourseCraft <onboarding@resend.dev>',
        to: [toEmail],
        subject: subject,
        text: textBody,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("🔥 HTTP REST SUCCESS LOG: Response from gateway ->", response.data);
    return { success: true, messageId: response.data.id };
  } catch (error) {
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("🚨 HTTP REST CRITICAL FAILURE LOG:", errorDetails);
    throw new Error(`REST API Mail Transport Error: ${errorDetails}`);
  }
};

export const sendContinuityReminder = async (toEmail, username, currentStreak) => {
  const subject = "CourseCraft Continuity Subscription Active 🚀";
  const body = `Hello ${username || 'Student'}!\n\nYou have successfully registered this email address for CourseCraft learning continuity alerts.\n\nYour current streak is ${currentStreak || 0} days. We will keep you updated on your streak milestones to maintain your learning momentum!\n\nKeep Learning!\nTeam CourseCraft`;
  return sendSystemNotification(toEmail, subject, body);
};
