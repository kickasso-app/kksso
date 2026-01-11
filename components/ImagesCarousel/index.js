import { useState, useEffect, useCallback } from "react";
// import { useState, useEffect, useCallback, useRef } from "react";
import ImageGallery from "react-image-gallery";

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
  // const firstImageRendered = useRef(false);

  const fetchImgs = useCallback(async () => {
    // console.time('ImageCarousel:totalLoad');
    setLoading(true);
    setImgs([]); // Clear previous images
    // firstImageRendered.current = false; // Reset for new fetches
    const imagePromises = await downloadImages({ userId }); // This now returns an array of promises

    if (imagePromises && imagePromises.length > 0) {
      let loadedCount = 0;
      const totalImages = imagePromises.length;

      imagePromises.forEach(async (promise, index) => {
        //console.time(`ImageCarousel:imageDownload-${index}`);
        try {
          const url = await promise;
          //console.timeEnd(`ImageCarousel:imageDownload-${index}`);
          if (url) {
            setImgs((prevImgs) => {
              const newImgs = [
                ...prevImgs,
                { original: url, originalHeight: 600 },
              ];
              // if (!firstImageRendered.current && newImgs.length > 0) {
              //   //console.timeEnd('ImageCarousel:firstDraw');
              //   firstImageRendered.current = true;
              // }
              return newImgs;
            });
          }
        } catch (error) {
          console.error("Error loading individual image:", error);
          //console.timeEnd(`ImageCarousel:imageDownload-${index}`); // End timer even on error
        } finally {
          loadedCount++;
          if (loadedCount === totalImages) {
            setLoading(false); // All promises have settled
            //console.timeEnd('ImageCarousel:totalLoad');
          }
        }
      });
    } else {
      setLoading(false);
      // console.timeEnd('ImageCarousel:totalLoad');
    }
  }, [userId]);

  useEffect(() => {
    // console.time('ImageCarousel:firstDraw'); // Start timer for first draw when fetchImgs is called
    fetchImgs();
  }, [fetchImgs]);

  return (
    <>
      {loading && imgs.length === 0 ? ( // Show loader only if no images are loaded yet
        (<Box pad="large">
          <img src={`/img/loader.svg`} />
        </Box>)
      ) : (
        <ImageGallery items={imgs} {...carouselConfig} />
      )}
    </>
  );
};

export default ImagesCarousel;
