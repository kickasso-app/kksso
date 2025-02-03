import { useState, useEffect, useCallback } from "react";
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

  const fetchImgs = useCallback(async () => {
    const urls = await downloadImages({ userId });
    // console.log(urls);

    if (urls) {
      setImgs(
        urls.map((img) => ({
          original: img,
          originalHeight: 600,
        }))
      );
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchImgs();
  }, [fetchImgs, userId]);

  return (
    <>
      {loading ? (
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
