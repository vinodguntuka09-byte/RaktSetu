const { Resend } = require("resend");

const sendEmail = async (to, subject, text) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
      console.log(`\n========================================`);
      console.log(`⚠️ [EMAIL SIMULATION LOG - RESEND ENV MISSING]`);
      console.log(`📩 To: ${to}`);
      console.log(`📌 Subject: ${subject}`);
      console.log(`----------------------------------------`);
      console.log(text);
      console.log(`========================================\n`);

      return {
        success: true,
        simulated: true,
      };
    }

    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      text: text,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(
      `✅ Email sent successfully to ${to}: ${response.data?.id || "N/A"}`
    );

    return {
      success: true,
      info: response.data,
    };
  } catch (error) {
    console.error(
      `❌ EMAIL ERROR sending to ${to}:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmail;