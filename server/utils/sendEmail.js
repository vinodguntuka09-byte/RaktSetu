const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.log(`\n========================================`);
      console.log(`⚠️ [EMAIL SIMULATION LOG - CREDENTIALS MISSING IN ENV]`);
      console.log(`📩 To: ${to}`);
      console.log(`📌 Subject: ${subject}`);
      console.log(`----------------------------------------`);
      console.log(text);
      console.log(`========================================\n`);
      return { success: true, simulated: true };
    }

    // ✅ Uses Gmail service with direct SSL (port 465) for reliable cloud delivery
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"RaktSetu" <${user}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ EMAIL ERROR sending to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
