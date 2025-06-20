import { sendEmail } from "./sendEmail";

const sendMagicLink = async ({ email }) => {
  let oldUser = {};
  let magicLinkSent = false;
  let magicLinkError = false;

  if (email) {
    oldUser = { email: email };
  } else {
    return { data: false, error: { message: "No input email" } };
  }

  try {
    const response = await fetch("/api/send-magic-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldUser }),
    });

    if (response.ok) {
      magicLinkSent = true;
      // console.log("Magic link email sent successfully!");
    } else {
      magicLinkError = await response.json();
      console.error("Error sending email:", magicLinkError.message);
    }
  } catch (error) {
    magicLinkError = error;
    console.error("There was a problem sending the email:", error);
  }
  return { data: magicLinkSent, error: magicLinkError };
};

export { sendMagicLink };
