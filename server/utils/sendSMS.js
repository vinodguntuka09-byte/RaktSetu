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

    if (!apiKey || !apiKey.trim()) {
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

    if (!message || !String(message).trim()) {
      console.warn(
        "⚠️ No SMS message provided"
      );

      return {
        success: false,
        error: "No SMS message provided",
      };
    }

    // ========================================
    // RECIPIENTS
    // ========================================

    const recipients = Array.isArray(to)
      ? to
      : [to];

    const numbers = recipients
      .map((number) =>
        String(number).replace(/\D/g, "")
      )
      .map((number) => {
        // Convert +91XXXXXXXXXX / 91XXXXXXXXXX
        // to 10-digit Indian mobile number
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
    // PREPARE SMS MESSAGE
    // ========================================
    // Keep SMS in plain English/ASCII so that
    // Unicode characters do not increase SMS parts.

    let finalMessage = String(message)
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // ========================================
    // ADD ONE RESPONSE LINK
    // ========================================

    if (
      responseLink &&
      !finalMessage.includes(responseLink)
    ) {
      finalMessage =
        `${finalMessage} ${responseLink}`.trim();
    }

    // ========================================
    // ONE-SMS SAFETY CHECK
    // ========================================
    // Quick SMS:
    // Maximum 160 ASCII characters for one part.

    const characterCount =
      finalMessage.length;

    if (characterCount > 160) {
      console.warn(
        `⚠️ SMS not sent: ${characterCount} characters exceeds the 160-character limit.`
      );

      return {
        success: false,
        error:
          `SMS message exceeds 160 characters (${characterCount}).`,
      };
    }

    // ========================================
    // FAST2SMS API
    // ========================================

    const url = new URL(
      "https://www.fast2sms.com/dev/bulkV2"
    );

    url.searchParams.set(
      "route",
      "q"
    );

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
          Authorization: apiKey.trim(),
          accept: "application/json",
        },
      }
    );

    const data =
      await response.json();

    // ========================================
    // HTTP ERROR
    // ========================================

    if (!response.ok) {
      throw new Error(
        data?.message ||
        `Fast2SMS request failed with status ${response.status}`
      );
    }

    // ========================================
    // FAST2SMS ERROR
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
      `📏 SMS Character Count: ${characterCount}/160`
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