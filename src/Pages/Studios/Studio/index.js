import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import ProgressiveImage from "react-progressive-image";
import moment from "moment";

// import { Box } from "grommet";

import { Disc, Hash } from "react-feather";

import "./studio.scss";

const Studio = ({
  article: { id, artist, city, styles, dates, teaserText, imageTeaser },
  openArticle,
}) => {
  return (
    <div className="article">
      <div className="article-info">
        <Link to={`/studio/${id}`} onClick={() => openArticle(id)}>
          <ProgressiveImage
            src={"/img/" + artist + "/" + imageTeaser + ".jpg"}
            placeholder={`/img/loader.svg`}
          >
            {(src, loading) => (
              <img
                id={`img-article-${id}`}
                onClick={() => openArticle(id)}
                style={{
                  margin: loading ? "33.3%" : "0",
                  width: loading ? "33.3%" : "100%",
                }}
                src={src}
                alt={artist}
              />
            )}
          </ProgressiveImage>
        </Link>

        <h4>{artist}</h4>

        <h4 className="secondary">
          <Disc size={18} strokeWidth="2" color="#4b4b4b" fill="#fff" /> {city}
        </h4>

        {dates && (
          <h4 className="secondary">
            Next Visit{" "}
            <strong>
              {moment(dates.split(",")[0], "DD/MM/YYYY hh:mm").format("D MMM")}
            </strong>
          </h4>
        )}

        <p>{teaserText}</p>

        {styles && (
          <h4 className="secondary">
            <Hash size={18} strokeWidth="2" color="#4b4b4b" fill="#fff" />{" "}
            {styles}
          </h4>
        )}
      </div>
    </div>
  );
};

Studio.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    dates: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    styles: PropTypes.string.isRequired,
    teaserText: PropTypes.string.isRequired,
    imageTeaser: PropTypes.string.isRequired,
  }).isRequired,
  openArticle: PropTypes.func.isRequired,
};

export default Studio;
