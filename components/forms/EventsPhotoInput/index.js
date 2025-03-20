import React, { useEffect, useState } from "react";
import { supabase } from "services/supabase";
import { useAuth } from "services/auth";
import { downloadEventImage, fileExists, resizeImage } from "services/images";

import {
  Grid,
  Box,
  Button,
  FileInput,
  Image,
  Text,
  Notification,
  Paragraph,
} from "grommet";
import { Edit2, X } from "react-feather";

const PHOTO_MAX_SIZE = 1048576; // 1 MB

const EventsPhotoInput = ({ userId, event, postUpload }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [editing, setEditing] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isPhotoTooLarge, setIsPhotoTooLarge] = useState(false);

  // console.log("event is", event);
  const imgDirectory = `${userId}/${event.id}`;
  // console.log(imgDirectory);
  const filePathLarge = `${imgDirectory}/event-large.jpg`;
  const filePathSmall = `${imgDirectory}/event-small.jpg`;

  useEffect(async () => {
    if (event) {
      const imgPath = filePathSmall;
      // console.log(imgPath);
      const doesImageExist = await fileExists(
        "events",
        imgDirectory,
        "event-small.jpg"
      );
      if (doesImageExist) {
        // console.log(imgPath);
        await downloadEventImage({
          imgPath: imgPath,
          postDownload: setImgUrl,
        });
        setEditing(!imgPath);
      }
    }
  }, [event]);

  async function removeImage() {
    try {
      let { error } = await supabase.storage
        .from("events")
        .move(filePathLarge, `${imgDirectory}/removed/${Date.now()}-`);

      if (error) {
        throw error;
      }

      setImgUrl(null);

      let { errorRemove } = await supabase.storage
        .from("events")
        .remove([filePathSmall]);
      if (errorRemove) {
        throw errorRemove;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setEditing(true);
    }
  }

  async function uploadImage({ event, imgName = "event" }) {
    try {
      setUploading(true);
      setIsPhotoTooLarge(false);
      if (imgUrl) await removeImage();
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${imgName}.${fileExt}`;

      if (file.size > PHOTO_MAX_SIZE) {
        setIsPhotoTooLarge(true);
        setUploading(false);
      } else {
        const [fileLarge, fileSmall] = await resizeImage({
          file: file,
          returnSmallerImage: true,
        });

        // console.log(fileLarge.size);
        // console.log(fileSmall.size);

        let { errorLarge } = await supabase.storage
          .from("events")
          .upload(filePathLarge, fileLarge, {
            cacheControl: "30",
            upsert: true,
          });

        let { errorSmall } = await supabase.storage
          .from("events")
          .upload(filePathSmall, fileSmall, {
            cacheControl: "30",
            upsert: true,
          });

        if (errorLarge || errorSmall) {
          throw errorLarge || errorSmall;
        }
        // await postUpload();
        // Append a timestamp query parameter to force a fresh download and bypass cache
        await downloadEventImage({
          imgPath: `${filePathSmall}?t=${Date.now()}`,
          postDownload: setImgUrl,
        });
        setEditing(false);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Grid
      rows={["small", "xxsmall"]}
      columns={["1fr", "auto"]}
      gap="small"
      areas={[
        { name: "photo", start: [0, 0], end: [0, 0] },
        { name: "icons", start: [0, 1], end: [0, 1] },
      ]}
      justify="start"
      align="center"
      pad="small"
    >
      <Box gridArea="photo">
        {editing || !imgUrl ? (
          <FileInput
            name="fileInput"
            id="fileInput"
            multiple={false}
            accept="image/*"
            disabled={uploading}
            onChange={async (event) => await uploadImage({ event })}
          />
        ) : (
          <>{imgUrl && <Image src={imgUrl} alt="Photo" height="200px" />}</>
        )}
      </Box>
      <Box gridArea="icons" direction="row" justify="center" gap="large">
        <Button
          icon={<Edit2 size={24} color="#222222" />}
          onClick={() => setEditing(!editing)}
        />
        <Button icon={<X size={24} color="#222222" />} onClick={removeImage} />
      </Box>
      {uploading && <img src={`/img/loader.svg`} />}
      <br />
      {isPhotoTooLarge && (
        <Notification
          toast
          status="warning"
          title="Your photo was not uploaded"
          message="Upload a smaller image, less than 1 Megabyte."
        />
      )}
    </Grid>
  );
};

export default EventsPhotoInput;
