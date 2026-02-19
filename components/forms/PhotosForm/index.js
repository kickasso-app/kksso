import { useState, useEffect, useCallback } from "react";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";
import { listImages, downloadRawImages } from "services/images";

import Button from "components/Button";
import PhotoInput from "./PhotoInput";

import { CheckCircle, XCircle } from "react-feather";

import {
  Box,
  Text,
  Heading,
  //   Grommet,
} from "grommet";

export default function PhotosForm() {
  const { user } = useAuth();
  const { fetchProfile } = useAccount();

  const [imgData, setImgData] = useState({});

  const [loading, setLoading] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const fetchImgsList = useCallback(async () => {
    setLoading(true);
    try {
      const paths = await listImages({ userId: user.id });
      const blobs = await downloadRawImages({ userId: user.id });

      setImgData((prevData) => {
        // Revoke old URLs to prevent memory leaks
        Object.values(prevData).forEach((img) => {
          if (img.url) URL.revokeObjectURL(img.url);
        });

        const nextData = {};
        paths?.forEach((path, index) => {
          const fileName = path.split("/").pop();
          const id = parseInt(fileName.split(".")[0]);
          if (!isNaN(id)) {
            nextData[id] = {
              path,
              url: blobs[index] ? URL.createObjectURL(blobs[index]) : null,
            };
          }
        });
        return nextData;
      });
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchImgsList();
  }, [fetchImgsList]);


  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Photos
        </Heading>
        <Text size="medium" margin={textMargin}>
          Add up to 5 photos of your work, your studio, and yourself. Please
          include one of each.
        </Text>
        <Text size="medium" margin={textMargin}>
          Please make sure that your image files are smaller than{" "}
          <b>1 MB per image</b>
        </Text>
        {[0, 1, 2, 3, 4].map((imgId) => {
          const img = imgData[imgId];
          return (
            <PhotoInput
              key={imgId}
              imgPath={img?.path ?? null}
              imgUrl={img?.url ?? null}
              imgId={imgId}
              isMainPhoto={imgId === 0}
              postUpload={async () => {
                await fetchImgsList();
                await fetchProfile(user);
              }}
              //   onSetMain={(imgId) => setMainPhoto(imgId)}
            />
          );
        })}
        <br />

        {!loading && (
          <>
            {isUpdateError && (
              <Text>
                <XCircle size={24} color="#FFC0CB" strokeWidth={3} />
                <br />
                We couldn't send your request this time.
                <br />
                Please try again.
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
