import { useEffect, useState } from "react";
import { supabase } from "services/supabase";
import { useAuth } from "services/auth";
import { downloadImage } from "services/images";

import { Edit2, X } from "react-feather";

import {
  Box,
  Form,
  FormField,
  MaskedInput,
  CheckBoxGroup,
  TextArea,
  TextInput,
  Text,
  Heading,
  FileInput,
  Grommet,
} from "grommet";

import Button from "components/Button";

export default function PhotoInput({
  imgPath,
  imgId,
  //   size,
  postUpload,
  //   onSetMain,
}) {
  const [imgUrl, setImgUrl] = useState(null);

  const [editing, setEditing] = useState(true);

  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();

  const isMainPhoto = imgPath?.includes("/0.");

  useEffect(() => {
    if (imgPath) {
      downloadImage({ imgPath, postDownload: setImgUrl });
      setEditing(!imgPath);
    }
  }, [imgPath]);

  async function removeImage() {
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
    } catch (error) {
      alert(error.message);
    } finally {
      setEditing(true);
    }
  }

  async function uploadImage({ event, imgName }) {
    try {
      setUploading(true);
      if (imgPath) await removeImage();
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${imgName}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      let { error } = await supabase.storage
        .from("studios-photos")
        .upload(filePath, file, {
          cacheControl: "30",
          upsert: true,
        });

      if (error) {
        throw error;
      }
      await postUpload();
      await downloadImage({ imgPath: filePath, postDownload: setImgUrl });
      setEditing(false);
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
          {editing ? (
            <FileInput
              //   style={{ width: size }}
              name="fileInput"
              id="fileInput"
              multiple={false}
              accept="image/*"
              maxSize={1000000}
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
        <Box width="small" pad="small">
          {imgUrl && (
            <Box direction="row" gap="large" pad="small">
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
          {isMainPhoto && <p>This is your main cover photo</p>}
        </Box>
      </Box>
    </div>
  );
}
