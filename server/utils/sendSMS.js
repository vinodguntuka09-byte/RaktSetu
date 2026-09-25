const sendSMS = async (
  to,
  message,
  responseLink = null
) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    // ========================================
    // CHECK API KEY
    // ========================================

    if (!apiKey) {
      console.warn(
        "⚠️ FAST2SMS_API_KEY is missing"
      );

      return {
        success: false,
        error: "FAST2SMS_API_KEY is missing",
      };
    }

    // ========================================
    // CHECK PHONE NUMBER
    // ========================================

    if (!to) {
      console.warn(
        "⚠️ No phone number provided for SMS"
      );

      return {
        success: false,
        error: "No phone number provided",
      };
    }

    // ========================================
    // CHECK MESSAGE
    // ========================================

    if (!message) {
      console.warn(
        "⚠️ No SMS message provided"
      );

      return {
        success: false,
        error: "No SMS message provided",
      };
    }

    // ========================================
    // ACCEPT SINGLE OR MULTIPLE NUMBERS
    // ========================================

    const recipients = Array.isArray(to)
      ? to
      : [to];

    const numbers = recipients
      .map((number) =>
        String(number).replace(/\D/g, "")
      )
      .map((number) => {
        // Convert +91XXXXXXXXXX or 91XXXXXXXXXX
        // into 10-digit Indian mobile number
        if (
          number.length === 12 &&
          number.startsWith("91")
        ) {
          return number.slice(2);
        }

        return number;
      })
      .filter(
        (number) => number.length === 10
      );

    if (numbers.length === 0) {
      console.warn(
        "⚠️ No valid Indian mobile numbers found"
      );

      return {
        success: false,
        error:
          "No valid Indian mobile numbers found",
      };
    }

    // ========================================
    // FINAL SMS MESSAGE
    // ========================================

    let finalMessage = String(message).trim();

    // Add response link if provided separately
    // and it is not already present in the message.
    if (
      responseLink &&
      !finalMessage.includes(responseLink)
    ) {
      finalMessage += `\n\nResponse Link:\n${responseLink}`;
    }

    // ========================================
    // FAST2SMS URL
    // ========================================

    const url = new URL(
      "https://www.fast2sms.com/dev/bulkV2"
    );

    url.searchParams.set("route", "q");
    url.searchParams.set(
      "message",
      finalMessage
    );
    url.searchParams.set(
      "numbers",
      numbers.join(",")
    );
    url.searchParams.set(
      "sms_details",
      "1"
    );

    // ========================================
    // SEND SMS
    // ========================================

    const response = await fetch(
      url.toString(),
      {
        method: "GET",
        headers: {
          Authorization: apiKey,
          accept: "application/json",
        },
      }
    );

    const data = await response.json();

    // ========================================
    // HANDLE HTTP ERROR
    // ========================================

    if (!response.ok) {
      throw new Error(
        data?.message ||
        `Fast2SMS request failed with status ${response.status}`
      );
    }

    // ========================================
    // HANDLE FAST2SMS ERROR
    // ========================================

    if (data?.return === false) {
      throw new Error(
        data?.message ||
        "Fast2SMS failed to send SMS"
      );
    }

    // ========================================
    // SUCCESS
    // ========================================

    console.log(
      `✅ SMS sent successfully to: ${numbers.join(
        ", "
      )}`
    );

    console.log(
      "📩 Fast2SMS Response:",
      data
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "❌ FAST2SMS ERROR sending SMS:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendSMS;