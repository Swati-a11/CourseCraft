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
