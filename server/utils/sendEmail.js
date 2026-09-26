const nodemailer = require("nodemailer");

const escapeHtml = (value) => {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendEmail = async (
  to,
  subject,
  text,
  responseLink = null
) => {
  try {
    const smtpHost = process.env.BREVO_SMTP_HOST;
    const smtpPort =
      Number(process.env.BREVO_SMTP_PORT) || 2525;
    const smtpUser = process.env.BREVO_SMTP_USER;
    const smtpPass = process.env.BREVO_SMTP_PASS;
    const sender = process.env.EMAIL_USER;

    // ========================================
    // EMAIL ENVIRONMENT CHECK
    // ========================================

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPass ||
      !sender
    ) {
      console.log(
        `\n========================================`
      );

      console.log(
        `⚠️ [EMAIL SIMULATION LOG - BREVO ENV MISSING]`
      );

      console.log(
        `📩 To: ${Array.isArray(to)
          ? to.join(", ")
          : to
        }`
      );

      console.log(
        `📌 Subject: ${subject}`
      );

      console.log(
        `----------------------------------------`
      );

      console.log(text);

      if (responseLink) {
        console.log(
          `🔗 Response: ${responseLink}`
        );
      }

      console.log(
        `========================================\n`
      );

      return {
        success: true,
        simulated: true,
      };
    }

    // ========================================
    // BREVO SMTP TRANSPORTER
    // ========================================

    const transporter =
      nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

    // ========================================
    // RECIPIENTS
    // ========================================

    const recipients = Array.isArray(to)
      ? to
      : [to];

    if (recipients.length === 0) {
      throw new Error(
        "No email recipients provided"
      );
    }

    // ========================================
    // REMOVE RAW RESPONSE LINK
    // FROM EMAIL BODY
    // ========================================

    let visibleText = String(text || "");

    if (responseLink) {
      visibleText = visibleText
        .split(responseLink)
        .join("")
        .trim();
    }

    // ========================================
    // HTML SAFE CONTENT
    // ========================================

    const safeText =
      escapeHtml(visibleText).replace(
        /\n/g,
        "<br>"
      );

    const safeResponseLink =
      responseLink
        ? escapeHtml(responseLink)
        : null;

    // ========================================
    // EMAIL TEMPLATE
    // ========================================

    const html = `
      <div
        style="
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.6;
          color: #222222;
          background-color: #ffffff;
          max-width: 650px;
          margin: 0 auto;
          padding: 24px;
        "
      >

        <div
          style="
            border: 1px solid #fecaca;
            border-radius: 18px;
            padding: 28px;
            background-color: #ffffff;
          "
        >

          <h2
            style="
              color: #dc2626;
              margin: 0 0 24px 0;
              font-size: 22px;
            "
          >
            🚨 RAKTSETU – EMERGENCY BLOOD REQUIREMENT
          </h2>

          <div
            style="
              font-size: 15px;
              color: #333333;
            "
          >
            ${safeText}
          </div>

          ${safeResponseLink
        ? `
                <div
                  style="
                    text-align: center;
                    margin-top: 30px;
                  "
                >
                  <a
                    href="${safeResponseLink}"
                    style="
                      display: inline-block;
                      background-color: #dc2626;
                      color: #ffffff;
                      text-decoration: none;
                      padding: 14px 24px;
                      border-radius: 10px;
                      font-weight: bold;
                      font-size: 14px;
                    "
                  >
                    🚨 RESPOND TO EMERGENCY REQUEST
                  </a>
                </div>
              `
        : ""
      }

        </div>

      </div>
    `;

    // ========================================
    // SEND EMAIL
    // ========================================

    const info =
      await transporter.sendMail({
        from: `"RaktSetu" <${sender}>`,
        to: recipients,
        subject,
        text: visibleText,
        html,
      });

    console.log(
      `✅ Email sent successfully to: ${recipients.join(
        ", "
      )}`
    );

    console.log(
      `📩 Message ID: ${info.messageId}`
    );

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.error(
      `❌ BREVO EMAIL ERROR sending to ${Array.isArray(to)
        ? to.join(", ")
        : to
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