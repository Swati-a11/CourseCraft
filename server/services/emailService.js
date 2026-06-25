export const sendSystemNotification = async (toEmail, subject, textBody) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY is missing in environment variables. Email notification skipped.");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // Resend default sandbox sender
        to: toEmail,
        subject: subject,
        text: textBody
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Resend API Error:", errorData);
    } else {
      console.log(`✉️ Email successfully sent to ${toEmail} using Resend.`);
    }
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error.message);
  }
};

export const sendContinuityReminder = async (toEmail, username, currentStreak) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY is missing in environment variables. Continuity reminder skipped.");
    return;
  }

  const subject = "🔥 Keep your CourseCraft learning streak alive!";
  
  const htmlBody = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <h2 style="color: #10b981; text-align: center; margin-bottom: 24px;">🔥 Don't Lose Your Streak!</h2>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hello <strong>${username}</strong>,</p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">You're doing amazing! Your current study streak is at <strong>${currentStreak} days</strong>. But you are in danger of resetting it if you don't check in today!</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://course-craft-ten.vercel.app/dashboard" style="background: linear-gradient(to right, #10b981, #06b6d4); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
          ⚡ Continue Learning Now
        </a>
      </div>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
        Consistency is the key to mastering new skills. Spend just 5 minutes today reviewing notes or taking a quick quiz to keep your momentum going strong!
      </p>
      <p style="font-size: 14px; color: #64748b; margin-top: 8px;">Happy Learning,<br><strong>The CourseCraft Team</strong></p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: toEmail,
        subject: subject,
        html: htmlBody,
        text: `Hello ${username},\n\nYour active learning streak of ${currentStreak} days is in danger of resetting! Log back in to CourseCraft, complete your daily activities, and keep the momentum going!\n\nHappy Learning,\nThe CourseCraft Team`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Resend API Error (Continuity Reminder):", errorData);
    } else {
      console.log(`✉️ Streak continuity reminder email successfully sent to ${toEmail}.`);
    }
  } catch (error) {
    console.error("❌ Failed to send continuity email via Resend:", error.message);
  }
};
