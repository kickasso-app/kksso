import ImageGallery from "react-image-gallery";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const carouselConfig = {
  showIndex: false,
  showBullets: true,
  infinite: true,
  showThumbnails: false,
  showFullscreenButton: false,
  showGalleryFullscreenButton: true,
  showPlayButton: false,
  showGalleryPlayButton: false,
  showNav: true,
  isRTL: false,
  slideDuration: 450,
  slideInterval: 2000,
  slideOnThumbnailOver: false,
  thumbnailPosition: "bottom",
  showVideo: {},
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

const ImagesCarousel = ({ images, artist }) => {
  const items = images.map((img) => ({
    original: `/img/${artist}/${img.filename}`,
    description: img.caption,
  }));
  // console.log(items);
  return <ImageGallery items={items} {...carouselConfig} />;
};

export default ImagesCarousel;
