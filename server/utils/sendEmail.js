const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const smtpHost = process.env.BREVO_SMTP_HOST;
    const smtpPort = Number(process.env.BREVO_SMTP_PORT) || 2525;
    const smtpUser = process.env.BREVO_SMTP_USER;
    const smtpPass = process.env.BREVO_SMTP_PASS;
    const sender = process.env.EMAIL_USER;

    if (!smtpHost || !smtpUser || !smtpPass || !sender) {
      console.log(`\n========================================`);
      console.log(`⚠️ [EMAIL SIMULATION LOG - BREVO ENV MISSING]`);
      console.log(
        `📩 To: ${Array.isArray(to) ? to.join(", ") : to}`
      );
      console.log(`📌 Subject: ${subject}`);
      console.log(`----------------------------------------`);
      console.log(text);
      console.log(`========================================\n`);

      return {
        success: true,
        simulated: true,
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const recipients = Array.isArray(to) ? to : [to];

    if (recipients.length === 0) {
      throw new Error("No email recipients provided");
    }

    const info = await transporter.sendMail({
      from: `"RaktSetu" <${sender}>`,
      to: recipients,
      subject,
      text,
    });

    console.log(
      `✅ Email sent successfully to: ${recipients.join(", ")}`
    );
    console.log(`📩 Message ID: ${info.messageId}`);

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.error(
      `❌ BREVO EMAIL ERROR sending to ${Array.isArray(to) ? to.join(", ") : to
      }:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmail;