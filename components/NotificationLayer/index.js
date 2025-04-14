"use client";

import { useState } from "react";
import { Box, Button, Grommet, Layer, Notification } from "grommet";
import { FormClose } from "grommet-icons";

export default function NotificationLayer({
  message,
  title,
  status = "normal",
  onClose = () => {},
}) {
  const [isVisible, setIsVisible] = useState(true);

  const onCloseNotification = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Layer
      position="center"
      modal
      onClickOutside={onCloseNotification}
      onEsc={onCloseNotification}
      responsive
      animation="fadeIn"
    >
      <Box
        pad={{ horizontial: "large", vertical: "large" }}
        gap="medium"
        // width={{ min: "500px", max: "800px" }}
        // height={{ min: "100px", max: "300px" }}
        // size={size === "small" ? "small" : "medium"}
        size={"xlarge"}
        responsive
        align="center"
      >
        {/* <Box direction="row" justify="between" align="center"> */}
        <Notification
          status={status}
          message={message}
          title={title}
          onClose={onCloseNotification}
        />
        {/* <Button
            icon={<FormClose />}
            onClick={closeNotification}
            plain
            hoverIndicator
          /> */}
        {/* </Box> */}
      </Box>
    </Layer>
  );
}
