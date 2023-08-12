import { useState, useEffect, useCallback } from "react";
import { supabase } from "services/supabase";

import { useAuth } from "services/auth";
import { listImages } from "services/images";

import Button from "components/Button";
import PhotoInput from "./PhotoInput";

import { CheckCircle, XCircle } from "react-feather";

import {
  Box,
  //   Form,
  //   FormField,
  //   MaskedInput,
  //   CheckBoxGroup,
  //   TextArea,
  //   TextInput,
  Text,
  Heading,
  //   Grommet,
} from "grommet";

export default function PhotosForm() {
  const [imgPaths, setImgPaths] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const { user, session } = useAuth();

  const fetchImgsList = useCallback(async () => {
    setLoading(true);
    const { imgs, paths } = await listImages({ userId: user.id });
    setImgPaths(paths ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImgsList();
  }, [fetchImgsList]);

  //   async function updatePhotosUrl(url) {
  //     try {
  //       setIsUpdateError(false);
  //       setLoading(true);
  //       let { error } = await supabase
  //         .from("studios")
  //         .update({ photoUrl: url }, { returning: "minimal" })
  //         .eq("uuid", user.id);

  //       if (error) {
  //         setIsUpdateError(true);
  //         throw error;
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Photos
        </Heading>
        <Text size="medium" margin={textMargin}>
          Add up to 5 photos of your work, your studio, and yourself
        </Text>
        <Text size="small" margin={textMargin}>
          Image files must be smaller than 1 MB per image
        </Text>
        {[0, 1, 2, 3, 4].map((imgId) => {
          return (
            <PhotoInput
              key={imgId}
              imgPath={imgPaths[imgId] ?? null}
              imgId={imgId}
              postUpload={async () => {
                await fetchImgsList();
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
