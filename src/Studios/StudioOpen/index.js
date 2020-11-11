import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import { Grid, Row, Col } from "react-flexbox-grid";
import ImagesCarousel from "./../../ImagesCarousel";
import { ChevronLeft } from "react-feather";

import EmailForm from "./../../EmailForm";

import "./../../styles/articleopen.scss";

const StudioOpen = ({
  article: {
    id,
    artist,
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
    return paragraphString.split(pSeparator).map((paragraph, index) => (
      // <p>
      <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
      // </p>
    ));
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

        <h2>{artist}</h2>

        <ImagesCarousel
          imgPaths={
            images !== undefined &&
            images
              .split(",")
              .map((imgId) => "/img/" + artist + "/" + imgId + ".jpg")
          }
          imgTexts={imagesText !== undefined && imagesText.split(";")}
        />

        <Row>
          <Col xs={12} md={6}>
            <br />
            <br />
            {makeParagraphs(artistText, paragraphSeperator)}
            <h3>Medium</h3>
            <p>{styles}</p>
            <h3>Studio</h3>
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
                  <h3>General Visit Etiquette</h3>
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
    rules: PropTypes.string.isRequired,
    artistText: PropTypes.string.isRequired,
    studioText: PropTypes.string.isRequired,
  }).isRequired,
  closeArticle: PropTypes.func.isRequired,
};

export default StudioOpen;
