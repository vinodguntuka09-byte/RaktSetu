import { isSupported, getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const generateToken = async () => {
  console.log("STEP 1");

  const supported = await isSupported();
  console.log("Messaging Supported:", supported);

  if (!supported) {
    alert("Firebase Messaging is not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();
  console.log("Permission:", permission);

  if (permission !== "granted") {
    alert("Permission denied");
    return;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BCxrQf1-jDOfewEXZ0xQLqmNI_RmIiCpnI5PHJ4KTK3UV_QGczx5Ggu6zMHHmvpSTwPjXcwrA_10t3MwAbZoUSU",
    });

    console.log("TOKEN:", token);
  } catch (err) {
    console.error(err);
  }
};