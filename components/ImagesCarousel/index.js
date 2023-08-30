import { useState, useEffect, useCallback } from "react";
import ImageGallery from "react-image-gallery";
import Flickity from "react-flickity-component";

import { downloadImages, getImagesUrls } from "services/images";

import { Box } from "grommet";

import styles from "./index.module.scss";

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

const imagesTest = [
  {
    original: "/img/Hoa Luo/0.jpg",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

const ImagesCarousel = ({ images, artist, userId }) => {
  const [imgs, setImgs] = useState([]);
  // const [imgUrls, setImgUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImgs = useCallback(async () => {
    const urls = await downloadImages({ userId });
    // const urls = await getImagesUrls({ userId });

    // console.log(urls);
    if (urls) {
      // setImgUrls(urls);
      setImgs(
        urls.map((img) => ({
          original: img,
          originalHeight: 600,
          // from local files
          // original: `/img/${artist}/${img.filename}`,
          // description: img.caption,
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
        // <div >
        // doesn't apply styles className={styles.studioGallery}
        <ImageGallery items={imgs} {...carouselConfig} />
        // <Box pad="large">
        //   {imgUrls && (
        //     <Flickity
        //     // disableImagesLoaded={true} // default false
        //     // reloadOnUpdate={true} // default false
        //     // static={true} // default false
        //     >
        //       {imgUrls.map((url) => {
        //         console.log(url);
        //         return <img src={url} />;
        //       })}
        //     </Flickity>
        //   )}
        // </Box>
        // </div>
      )}
    </>
  );
};

export default ImagesCarousel;
