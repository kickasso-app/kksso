export const sendEmail = async ({
  emailTemplate,
  emailDetails,
  emailVariables,
  recipient,
}) => {
  let emailSent = false;
  let errorMsg = false;
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailTemplate,
        emailDetails,
        emailVariables,
        recipient,
      }),
    });

    if (response.ok) {
      emailSent = true;
      // console.log("Email sent successfully!");
    } else {
      const errorDetails = await response.json();
      console.error("Error sending email:", errorDetails.message);
      errorMsg = errorDetails.message;
    }
  } catch (error) {
    console.error("There was a problem sending the email:", error);
  }
  return { emailSent, error: { message: errorMsg } };
};
