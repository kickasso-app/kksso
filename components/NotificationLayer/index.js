"use client";

import { useState, useEffect, useContext } from "react";

import { Box, Layer, Text, Notification, ResponsiveContext } from "grommet";

import { CheckCircle, AlertCircle } from "react-feather";

const notificationIcons = {
  normal: <CheckCircle size="24px" color="#80AAA0" />,
  warning: <AlertCircle size="24px" color="#AA8088" />,
};

export default function NotificationLayer({
  message,
  title,
  status = "normal",
  onClose = () => {},
  autoClose = 3000,
}) {
  const size = useContext(ResponsiveContext);

  const isMobile = size === "small";

  const [isVisible, setIsVisible] = useState(true);

  const PaddedMessage = message ? (
    <Text>
      <br /> {message}
    </Text>
  ) : (
    ""
  );

  const onCloseNotification = () => {
    setIsVisible(false);
    onClose();
  };

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onCloseNotification();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible]);

  if (!isVisible) return null;

  return (
    <Layer
      position="bottom-right"
      modal={isMobile}
      full={isMobile}
      margin={isMobile ? "none" : { vertical: "medium", horizontal: "small" }}
      responsive={false}
      onClickOutside={onCloseNotification}
      onEsc={onCloseNotification}
      animation="fadeIn"
      plain={!isMobile} // Remove default modal styling on desktop
    >
      <Box
        align="center"
        justify="center"
        fill={isMobile}
        background="white"
        pad={isMobile ? "medium" : ""}
      >
        <Notification
          status={status}
          message={PaddedMessage}
          title={title}
          onClose={onCloseNotification}
          icon={notificationIcons[status]}
          pad="medium"
          elevation="medium"
          round="small"
        />
      </Box>
    </Layer>
  );
}


