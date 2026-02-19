import { useEffect, useState, useContext } from "react";
import { supabase } from "services/supabase";
import { useAuth } from "services/auth";
import { downloadImage, resizeImage } from "services/images";
import { Edit2, X } from "react-feather";
import {
  Box,
  FileInput,
  Paragraph,
  ResponsiveContext,
} from "grommet";
import Button from "components/Button";
import ToastNotification from "components/ToastNotification";

const PHOTO_MAX_SIZE = 1048576; // 1 MB

export default function PhotoInput({
  imgPath,
  imgId,
  isMainPhoto,
  postUpload,
  imgUrl: initialImgUrl,
  //   onSetMain,
}) {
  const [imgUrl, setImgUrl] = useState(initialImgUrl);
  const [editing, setEditing] = useState(!initialImgUrl);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const { user } = useAuth();
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    setImgUrl(initialImgUrl);
    setEditing(!initialImgUrl);
  }, [initialImgUrl, imgPath]);

  async function removeImage() {
    setNotification(null);
    const newImgPath = imgPath.replace("/", `/removed/${Date.now()}-`);
    try {
      let { error } = await supabase.storage
        .from("studios-photos")
        //.remove([imgPath]);
        // remove not functional
        .move(imgPath, newImgPath);

      if (error) {
        throw error;
      }

      setImgUrl(null);
      setNotification({
        success: true,
        type: "Photo Removal",
      });
      if (postUpload) await postUpload();
    } catch (error) {
      setNotification({
        warning: true,
        type: "Photo Removal",
        message: error.message,
      });
    } finally {
      setEditing(true);
    }
  }

  async function uploadImage({ event, imgName }) {
    try {
      setUploading(true);
      setNotification(null);

      if (imgPath) await removeImage();
      if (!event.target.files?.[0]) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileName = `${imgName}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      if (file.size > PHOTO_MAX_SIZE) {
        setNotification({
          warning: true,
          type: "Photo Upload",
          message: "Upload a smaller image, less than 1 Megabyte.",
        });
        return;
      }

      let errors = [];

      if (isMainPhoto) {
        const filePathSmall = `${user.id}/profile.jpg`;
        const [fileLarge, fileSmall] = await resizeImage({
          file,
          returnSmallerImage: true,
        });

        // Upload large version
        const { error: errorLarge } = await supabase.storage
          .from("studios-photos")
          .upload(filePath, fileLarge, {
            cacheControl: "30",
            upsert: true,
          });
        if (errorLarge) errors.push(errorLarge);

        // Upload small version
        const { error: errorSmall } = await supabase.storage
          .from("studios-photos")
          .upload(filePathSmall, fileSmall, {
            cacheControl: "30",
            upsert: true,
          });
        if (errorSmall) errors.push(errorSmall);
      } else {
        const [fileLarge] = await resizeImage({
          file,
          returnSmallerImage: false,
        });

        const { error: errorLarge } = await supabase.storage
          .from("studios-photos")
          .upload(filePath, fileLarge, {
            cacheControl: "30",
            upsert: true,
          });
        if (errorLarge) errors.push(errorLarge);
      }

      if (errors.length) {
        throw new Error(
          `Upload failed: ${errors.map((e) => e.message).join(", ")}`
        );
      }

      if (postUpload) await postUpload();
      setNotification({
        success: true,
        type: "Photo Upload",
      });
      setEditing(false);
    } catch (error) {
      console.error("Upload error:", error);
      setNotification({
        warning: true,
        type: "Photo Upload",
        message: error.message,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Box
        // width={size === "small" ? "100%" : null}
        direction="row-responsive"
        align="center"
        pad="medium"
        gap="large"
        margin={{ vertical: "large", horizontal: "medium" }}
        fill="horizontal"
      >
        <Box
          align="center"
          alignContent="center"
          width={size === "small" ? "90%" : "small"}
          height={size === "small" ? "small" : "small"}
        >
          {editing ? (
            <FileInput
              style={{ width: size === "small" ? "100%" : "auto" }} // Use the size from context
              name="fileInput"
              id="fileInput"
              multiple={false}
              accept="image/*"
              disabled={uploading}
              onChange={async (event) =>
                await uploadImage({ event, imgName: imgId })
              }
            />
          ) : (
            <>
              {imgUrl && (
                <img src={imgUrl} alt="Photo" style={{ height: "100%" }} />
              )}
            </>
          )}
        </Box>
        <Box
          align="center"
          alignContent="center"
          width={size === "small" ? "90%" : "medium"}
          pad="small"
          size="large"
        >
          {imgUrl && (
            <Box direction="row" gap="large">
              <Edit2
                size={24}
                color="#222222"
                strokeWidth={1.5}
                onClick={() => setEditing(!editing)}
              />
              {!isMainPhoto && (
                <X
                  size={24}
                  color="#222222"
                  strokeWidth={1.5}
                  onClick={removeImage}
                />
              )}
            </Box>
          )}

          {uploading && <img src={`/img/loader.svg`} />}

          <br />
          {isMainPhoto && <Paragraph fill>Your main studio photo</Paragraph>}

          {notification && (
            <ToastNotification
              {...notification}
              onClose={() => setNotification(null)}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}
