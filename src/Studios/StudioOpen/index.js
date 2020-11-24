import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import { Grid, Row, Col } from "react-flexbox-grid";
import ImagesCarousel from "./../../ImagesCarousel";
import { ChevronLeft, Disc } from "react-feather";

import EmailForm from "./../../EmailForm";

import "./../../styles/articleopen.scss";

const StudioOpen = ({
  article: {
    id,
    artist,
    city,
    styles,
    dates,
    images,
    imagesText,
    artistText,
    studioText,
    rules,
    email,
  },
  closeArticle,
}) => {
  // const createMarkup = (raw) => {
  //   return { __html: raw };
  // };

  const paragraphSeperator = "\\";

  const makeParagraphs = (paragraphString, pSeparator) => {
    return paragraphString
      .split(pSeparator)
      .map((paragraph, index) => (
        <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
      ));
  };

  const makeImagesArray = () => {
    const imgUrls =
      images !== undefined &&
      images.split(",").map((imgId) => "/img/" + artist + "/" + imgId + ".jpg");

    const imgTexts = imagesText !== undefined && imagesText.split(";");

    const imgs = imgUrls.reduce((acc, current, index) => {
      acc.push({ url: imgUrls[index], caption: imgTexts[index] || "" });
      return acc;
    }, []);

    return imgs;
  };

  return (
    <Grid fluid className="article-open">
      <Col xs={12}>
        <Link
          className="pinklink"
          to={`/studios/`}
          onClick={() => closeArticle()}
        >
          <ChevronLeft size={14} /> BACK
        </Link>
        <br />

        <ImagesCarousel images={makeImagesArray()} />

        <Row>
          <Col xs={12} md={6}>
            <br />

            <h2>{artist}</h2>

            <br />
            {makeParagraphs(artistText, paragraphSeperator)}

            <h3>Mediums</h3>
            <p>{styles}</p>

            <h3>Studio</h3>

            <h4>
              <Disc size={18} strokeWidth="2" color="#7fffd4" fill="#fff" />{" "}
              {city}
            </h4>

            {makeParagraphs(studioText, paragraphSeperator)}
          </Col>
          <Col xs={12} md={5} mdOffset={1}>
            <Row>
              {dates && (
                <>
                  {rules.length > 0 && (
                    <>
                      <h3>{artist.split(" ")[0]}'s Visit Rules</h3>
                      <br />
                      <ul>
                        {rules.split(";").map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <h3>General Visit Tips</h3>
                  <ul>
                    <li>Show up on time</li>
                    <li>Ask before taking photos of the artist and artworks</li>
                    <li>A gift is almost always a nice touch</li>
                  </ul>
                  <EmailForm
                    openVisitDates={dates.split(",")}
                    artistEmail={email}
                    artistName={artist}
                  />
                </>
              )}
            </Row>
          </Col>
        </Row>
      </Col>
    </Grid>
  );
};
StudioOpen.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    dates: PropTypes.string.isRequired,
    styles: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    rules: PropTypes.string.isRequired,
    artistText: PropTypes.string.isRequired,
    studioText: PropTypes.string.isRequired,
  }).isRequired,
  closeArticle: PropTypes.func.isRequired,
};

export default StudioOpen;
