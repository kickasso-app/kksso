import { sendEmail } from "./sendEmail";

const sendMagicLink = async ({ email }) => {
  let oldUser = {};
  let isMagicLinkCreated = false;
  let isMagicLinkSent = false;

  if (email) {
    oldUser = { email: email };
  } else {
    console.warn("No email for user");
    return false; // Or throw an error, depending on your error handling strategy
  }

  try {
    const response = await fetch("/api/create-magic-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldUser }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create magic link");
    } else {
      isMagicLinkCreated = true;
      const magicData = await response.json();

      if (magicData.data.doesUserExist === true) {
        const magicLink = magicData.data.link;
        //  console.log(magicLink);

        const emailRequestDetails = {
          subject: "Your Magic Link for Arti ",
          toEmail: [email],
          fromEmail: "default",
        };

        const { emailSent, error: emailError } = await sendEmail({
          emailTemplate: "magicLinkTemplate",
          emailDetails: emailRequestDetails,
          emailVariables: { magic: magicLink },
        });

        if (emailSent) {
          isMagicLinkSent = true;
        } else {
          console.log(emailError.message);
        }
      }
    }
  } catch (error) {
    console.error("Error creating or sending magic link:", error);
  }
  return isMagicLinkSent;
};

export { sendMagicLink };
