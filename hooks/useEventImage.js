import { useState, useEffect } from "react";
import { fileExists, downloadEventImage } from "services/images";

export default function useEventImage(event, variant = "small") {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      if (event && !imgUrl) {
        const imgPath = `${event.studio_uuid}/${event.id}`;
        const fileName =
          variant === "small" ? "event-small.jpg" : "event-large.jpg";
        const exists = await fileExists("events", imgPath, fileName);
        if (exists) {
          await downloadEventImage({
            imgPath: `${imgPath}/${fileName}`,
            postDownload: setImgUrl,
          });
        }
      }
    }
    fetchImage();
  }, [event, imgUrl, variant]);

  return [imgUrl, setImgUrl];
}
