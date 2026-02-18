import NotificationLayer from "components/NotificationLayer";

export default function ToastNotification({
  success,
  warning,
  type,
  message,
  onClose,
  autoClose = 3000,
}) {
  let titleSuccess = "Success";
  let titleError = "Error";
  let messageError =
    "We couldn't complete your request this time. Please try again.";


  if (type === "Update Profile") {
    titleSuccess = "Your profile was updated successfully.";
    titleError = "Your profile was not updated";
  } else if (type === "Photo Upload") {
    titleSuccess = "Your photo was uploaded successfully.";
    titleError = "Your photo was not uploaded";    
    if (message   ) {
      messageError = message;
    }
  } else if (type === "Update Event") {
    titleSuccess = "Your event was updated successfully.";
    titleError = "Your event was not updated";
  }

  if (success) {
    return (
      <NotificationLayer
        status="normal"
        title={titleSuccess}
        message={message}
        onClose={onClose}
        autoClose={autoClose}
      />
    );
  }

  if (warning) {
    return (
      <NotificationLayer
        status="warning"
        title={titleError}
        message={message || messageError}
        onClose={onClose}
        autoClose={false}
      />
    );
  }

  return null;
}
