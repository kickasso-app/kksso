import { useState, useEffect, useRef } from "react";
import { fileExists, downloadEventImage } from "services/images";

export default function useEventImage(event, variant = "small") {
  const [imgUrl, setImgUrl] = useState(null);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const prevEventId = useRef(null);

  useEffect(() => {
    if (!event || !event.id) return;

    // When a new event is provided, reset the image and loading flag immediately
    if (event.id !== prevEventId.current) {
      setImgUrl(null);
      setIsImgLoaded(false);
      prevEventId.current = event.id;
    }

    async function fetchImage() {
      const imgPath = `${event.studio_uuid}/${event.id}`;
      const fileName =
        variant === "small" ? "event-small.jpg" : "event-large.jpg";
      const exists = await fileExists("events", imgPath, fileName);
      if (exists) {
        await downloadEventImage({
          imgPath: `${imgPath}/${fileName}?t=${Date.now()}`,
          postDownload: (downloadedUrl) => {
            setImgUrl(downloadedUrl);
            setIsImgLoaded(true);
          },
        });
      }
    }
    fetchImage();
  }, [event?.id, variant]);

  return [imgUrl, setImgUrl, isImgLoaded];
}
