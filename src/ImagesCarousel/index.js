import React , { useState, useEffect} from "react";

import { Grommet, Box, Carousel, Text } from "grommet";
import ReactMarkdown from "react-markdown";

const customTheme = {
  carousel: {
    animation: {
      duration: 400,
    },
    background: {
      color: "#fff",
    },
    icons: {
      color: "#ff4500",
    },
    disabled: {
      icons: {
        color: "#4b4b4b",
      },
    },
    margin: {
      vertical: "large",
    },
  },
};

const ImagesCarousel = ({ images, controls, ...rest }) => {
  
  // console.log("once");

  const [imgsLoaded, setImgsLoaded] = useState(false);

  useEffect(() => {
    const loadImage = imgUrl => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image()
        loadImg.src = imgUrl
        // wait 2 seconds to simulate loading time
        loadImg.onload = () =>
          setTimeout(() => {
            resolve(imgUrl)
          }, 2000)

        loadImg.onerror = err => reject(err)
      })
    }

    Promise.all(images.map(img => loadImage(img.url)))
      .then(() => setImgsLoaded(true))
      .catch(err => console.log("Failed to load images", err))
  }, [images])

  
  
  return (
    <Grommet theme={customTheme}>
      <Box align="center">

      {!imgsLoaded ? (
          <Box>
             <img src={`/img/loader.svg`} alt="loader" />
          </Box>
        ):( 
          <Carousel controls={controls} {...rest}>
          {images.map((img, index) => 
              <Box pad={{ horizontal: "large", vertical: "small" }} key={index}>
                <img
                  className="article-photo"
                  src={img.url}
                  alt={img.caption}
                /> 
                <Text
                  size="small"
                  margin={{ bottom: "medium", top: "small" }}
                  alignSelf="center"
                >
                  <ReactMarkdown>{img.caption}</ReactMarkdown>
                </Text>
              </Box>
            )
          }
        </Carousel>
         )} 
        
      </Box>
    </Grommet>
  );
};

export default ImagesCarousel;
