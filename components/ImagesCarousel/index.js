'use client';

import { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import Image from "next/image";
import "react-image-gallery/styles/css/image-gallery.css";
import styles from "./index.module.scss";

import { getPublicImageUrls } from "services/images";

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
  slideInterval: 3000,
  slideOnThumbnailOver: false,
  thumbnailPosition: "bottom",
  showVideo: {},
  loading: "lazy",
  lazyload: true,
};

const ImagesCarousel = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadImages = async () => {
      try {
        const urls = await getPublicImageUrls({ userId });
        
        if (!active) return;

        if (urls && urls.length > 0) {
          const galleryItems = urls.map((url) => ({
            original: url,
          }));
          setItems(galleryItems);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (userId) {
      loadImages();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [userId]);

  const renderItem = (item) => {
    return (
      <div className={styles.slideWrapper}>
        <Image
          src={item.original}
          alt="Studio Gallery Image"
          width={1200}
          height={800}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority={items.indexOf(item) === 0}
        />
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <Box pad="large">
          <img src={`/img/loader.svg`} alt="Loading..." />
        </Box>
      ) : (
        items.length > 0 && (
          <ImageGallery 
            items={items} 
            renderItem={renderItem}
            {...carouselConfig} 
          />
        )
      )}
    </>
  );
};

export default ImagesCarousel;
