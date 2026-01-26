import { useState, useEffect, useRef } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { downloadImages } from "services/images";

import { Box } from "grommet";

const carouselConfig = {
  showIndex: false,
  showBullets: true,
  infinite: true,
  showThumbnails: false,
  showFullscreenButton: true,
  useBrowserFullscreen: false,
  showPlayButton: false,
  showGalleryPlayButton: false,
  showNav: true,
  isRTL: false,
  slideDuration: 450,
  slideInterval: 2000,
  slideOnThumbnailOver: false,
  thumbnailPosition: "bottom",
  showVideo: {},
  loading: "lazy",
  lazyload: true,
  originalHeight: "60vh",
};

const ImagesCarousel = ({ userId }) => {
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef({ userId: null, promise: null });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setImgs([]);

    const loadImages = async () => {
      let currentPromise;

      if (loadingRef.current.userId === userId) {
        currentPromise = loadingRef.current.promise;
      } else {
        currentPromise = downloadImages({ userId });
        loadingRef.current = { userId, promise: currentPromise };
      }

      try {
        const imagePromises = await currentPromise;

        if (!active) return;

        if (imagePromises && imagePromises.length > 0) {
          for (const promise of imagePromises) {
            try {
              const url = await promise;
              if (!active) break;
              if (url) {
                setImgs((prevImgs) => {
                  if (prevImgs.some((img) => img.original === url)) {
                    return prevImgs;
                  }
                  return [
                    ...prevImgs,
                    { original: url, originalHeight: 600 },
                  ];
                });
                setLoading(false); // Show carousel as soon as the first image is ready
              }
            } catch (error) {
              console.error("Error loading individual image:", error);
            }
          }
        } else {
          if (active) setLoading(false);
        }
      } catch (error) {
        console.error("Error in downloadImages:", error);
        if (active) setLoading(false);
      }
    };

    loadImages();

    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <>
      {loading && imgs.length === 0 ? ( // Show loader only if no images are loaded yet
        <Box pad="large">
          <img src={`/img/loader.svg`} />
        </Box>
      ) : (
        <ImageGallery items={imgs} {...carouselConfig} />
      )}
    </>
  );
};

export default ImagesCarousel;
