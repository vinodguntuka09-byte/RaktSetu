const sendSMS = async (to) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ FAST2SMS_API_KEY is missing");
      return {
        success: false,
        error: "FAST2SMS_API_KEY is missing",
      };
    }

    if (!to) {
      console.warn("⚠️ No phone number provided for SMS");
      return {
        success: false,
        error: "No phone number provided",
      };
    }

    // Accept single number or multiple numbers
    const recipients = Array.isArray(to) ? to : [to];

    const numbers = recipients
      .map((number) => String(number).replace(/\D/g, ""))
      .map((number) => {
        if (number.length === 12 && number.startsWith("91")) {
          return number.slice(2);
        }

        return number;
      })
      .filter((number) => number.length === 10);

    if (numbers.length === 0) {
      console.warn("⚠️ No valid Indian mobile numbers found");
      return {
        success: false,
        error: "No valid Indian mobile numbers found",
      };
    }

    const message =
      "🚨 RaktSetu Emergency Blood Alert! A nearby hospital urgently needs blood. Please login to RaktSetu immediately if you are willing to donate. Thank you ❤️";

    const url = new URL(
      "https://www.fast2sms.com/dev/bulkV2"
    );

    url.searchParams.set("route", "q");
    url.searchParams.set("message", message);
    url.searchParams.set("numbers", numbers.join(","));
    url.searchParams.set("sms_details", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: apiKey,
        accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
        `Fast2SMS request failed with status ${response.status}`
      );
    }

    if (data?.return === false) {
      throw new Error(
        data?.message || "Fast2SMS failed to send SMS"
      );
    }

    console.log(
      `✅ SMS sent successfully to: ${numbers.join(", ")}`
    );

    console.log("📩 Fast2SMS Response:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      `❌ FAST2SMS ERROR sending SMS:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendSMS;