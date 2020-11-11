import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import ProgressiveImage from "react-progressive-image";

import moment from "moment";

import "./../styles/article.scss";

const Article = ({
  article: { id, artist, styles, dates, teaserText, imageTeaser },
  openArticle,
}) => {
  // const createMarkup = (raw) => {
  //   return { __html: raw };
  // };

  return (
    <div className="article">
      <div className="article-info">
        <Link to={`/studio/${id}`} onClick={() => openArticle(id)}>
          <ProgressiveImage
            src={"/img/" + artist + "/" + imageTeaser + ".jpg"}
            placeholder={`https://drive.google.com/uc?id=1m_AKM-NObKai64_ErCrVm8uQD3009m5z`}
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
        {styles && (
          <h4 className="secondary">
            {""}
            {styles}
          </h4>
        )}
        {dates && (
          <h4 className="secondary">
            Next Visit{" "}
            <strong>
              {moment(dates.split(",")[0], "DD/MM/YYYY hh:mm").format("D MMM")}
            </strong>
          </h4>
        )}
        <p>{teaserText}</p>
      </div>
    </div>
  );
};

Article.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    dates: PropTypes.string.isRequired,
    styles: PropTypes.string.isRequired,
    teaserText: PropTypes.string.isRequired,
    imageTeaser: PropTypes.string.isRequired,
  }).isRequired,
  openArticle: PropTypes.func.isRequired,
};

export default Article;
