import { useEffect, useState } from "react";

import { supabase } from "services/supabase";
import { useAuth } from "services/auth";
import { downloadEventImage, fileExists, resizeImage } from "services/images";

import { Edit2, X } from "react-feather";

import { Box, Notification, FileInput } from "grommet";

import Button from "components/Button";
const PHOTO_MAX_SIZE = 1048576; // 1 MB

export default function EventsPhotoInput({ userId, postUpload }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [editing, setEditing] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isPhotoTooLarge, setIsPhotoTooLarge] = useState(false);

  const { user } = useAuth();

  useEffect(async () => {
    if (userId) {
      const imgPath = `${userId}/event-small.jpg`;
      const doesImageExist = await fileExists(
        "events",
        userId,
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
  }, [userId]);

  async function removeImage() {
    try {
      let { error } = await supabase.storage
        .from("events")
        .move(`${userId}/event-large.jpg`, `${userId}/removed/${Date.now()}-`);

      if (error) {
        throw error;
      }

      setImgUrl(null);

      let { errorRemove } = await supabase.storage
        .from("events")
        .remove([`${userId}/event-small.jpg`]);
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
      //       const filePath = `${user.id}/${fileName}`;
      const filePathLarge = `${user.id}/event-large.jpg`;
      const filePathSmall = `${user.id}/event-small.jpg`;

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
        await postUpload();
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
    <div>
      <Box
        width="medium"
        height="small"
        direction="row-responsive"
        align="center"
        pad="medium"
        gap="large"
        margin="medium"
      >
        <Box align="center" width="small" height="small">
          {editing || !imgUrl ? (
            <FileInput
              //   style={{ width: size }}
              name="fileInput"
              id="fileInput"
              multiple={false}
              accept="image/*"
              // maxSize={PHOTO_MAX_SIZE} // not working, using manual check
              disabled={uploading}
              onChange={async (event) => await uploadImage({ event })}
            />
          ) : (
            <>
              {imgUrl && (
                <img src={imgUrl} alt="Photo" style={{ height: "100%" }} />
              )}
            </>
          )}
        </Box>
        <Box width="small" pad="small">
          {imgUrl && (
            <Box direction="row" gap="large" pad="small">
              <Edit2
                size={24}
                color="#222222"
                strokeWidth={1.5}
                onClick={() => setEditing(!editing)}
              />
              <X
                size={24}
                color="#222222"
                strokeWidth={1.5}
                onClick={removeImage}
              />
            </Box>
          )}

          {uploading && <img src={`/img/loader.svg`} />}

          <br />
          {isPhotoTooLarge && (
            <Notification
              toast
              status="warning"
              title="Your photo was not uploaded"
              message="Upload a smaller image, less than 1 Megabyte."
              // onClose={() => {}}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}
