import React, { useState, useEffect } from "react";
import { Box, Image, Heading, Text, Button } from "grommet";
// import { Edit, Trash } from "grommet-icons";

import { Edit3, Eye } from "react-feather";
import useEventImage from "hooks/useEventImage";

const EventCardEdit = ({ event, imgPath, onEdit, onView }) => {
  const [imgUrl, setImgUrl] = useEventImage(event, "small");

  return (
    <Box
      direction="row"
      align="center"
      justify="between"
      border={{ color: "light-4", size: "xsmall" }}
      pad="small"
      round="small"
      margin={{ vertical: "medium" }}
      fill="horizontal"
    >
      <Box direction="row" gap="medium" align="center">
        {imgUrl ? (
          <img src={imgUrl} alt="Event" width="80px" />
        ) : (
          <Box
            width="60px"
            height="100px"
            background="light-3"
            align="center"
            justify="center"
          >
            <Text size="small">No Img</Text>
          </Box>
        )}
        <Box>
          <Heading level="4" margin={{ vertical: "small" }}>
            {event.title || "Untitled"}
          </Heading>
          <Text size="small">{event.type}</Text>

          {event?.date ? (
            <Text size="small">On {event.date}</Text>
          ) : (
            <Text size="small">On unspecified date</Text>
          )}
          <Text size="small" margin={{ top: "small" }}>
            <b>{event?.isPublished ? "Published" : "Not Published"}</b>
          </Text>
        </Box>
      </Box>
      <Box align="right">
        <Box direction="row" gap="xsmall">
          {event.isPublished && (
            <Button
              icon={<Eye size={20} color="#4b4b4b" />}
              onClick={() => onView && onView(event.id)}
              hoverIndicator
            />
          )}
          <Button
            icon={<Edit3 size={20} color="#FFC0CB" strokeWidth={3} />}
            onClick={() => onEdit(event.id)}
            hoverIndicator
          />
        </Box>
        {/* <Box margin={{ top: "medium" }} direction="row" gap="small">
{/* <Button
            icon={<Trash />}
            onClick={() => onDelete(event.id)}
            hoverIndicator
          /> 
          <Button
            primary
            label={published ? "Unpublish" : "Publish"}
            onClick={handleToggle}
          />
        </Box> */}
      </Box>
    </Box>
  );
};

export default EventCardEdit;
