import React from "react";

import { Grommet, Box, Carousel, Text, Markdown } from "grommet";
import ProgressiveImage from "react-progressive-image";
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

const ImagesCarousel = ({ imgPaths, imgTexts, controls, ...rest }) => (
  <Grommet theme={customTheme}>
    <Box align="center">
      <Carousel controls={controls} {...rest}>
        {imgPaths.map((imgPath, index) => {
          return (
            <Box pad={{ horizontal: "large", vertical: "small" }} key={index}>
              <ProgressiveImage
                src={imgPath}
                placeholder={`https://drive.google.com/uc?id=1m_AKM-NObKai64_ErCrVm8uQD3009m5z`}
              >
                {(src, loading) => (
                  <img
                    className="article-photo"
                    style={{
                      margin: loading ? "10% 33.3% 10% 33.3%" : "0 auto",
                      // opacity: loading ? 0 : 1,
                      // delay: index > 0 && 2000,
                      maxWidth: loading ? "33.3%" : "100%",
                    }}
                    src={src}
                    alt={imgPath}
                  />
                )}
              </ProgressiveImage>
              <Text
                size="small"
                margin={{ bottom: "medium", top: "small" }}
                alignSelf="center"
              >
                <ReactMarkdown>{imgTexts[index]}</ReactMarkdown>{" "}
              </Text>
            </Box>
          );
        })}
      </Carousel>
    </Box>
  </Grommet>
);

export default ImagesCarousel;
