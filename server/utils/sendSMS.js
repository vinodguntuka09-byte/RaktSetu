const twilio = require("twilio");

const sendSMS = async (to) => {
  try {
    if (!to) {
      console.warn("⚠️ No phone number provided for SMS");
      return {
        success: false,
        error: "No phone number provided",
      };
    }

    // Make sure the number is in E.164 format
    const formattedNumber = to.startsWith("+")
      ? to
      : `+91${to}`;

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
      body: "sms_internal_alerts",
    });

    console.log(`✅ Trial SMS sent successfully to ${formattedNumber}`);
    console.log(`📩 Message SID: ${message.sid}`);

    return {
      success: true,
      sid: message.sid,
    };
  } catch (error) {
    console.error(
      `❌ TWILIO SMS ERROR sending to ${to}:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendSMS;