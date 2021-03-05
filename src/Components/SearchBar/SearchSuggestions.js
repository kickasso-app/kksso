import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isNotNull } from "ramda-adjunct";

// import { getDepth } from '../../../utils/helpers';
import { useOuterClick } from "./useOuterCallback";
// import {
//   DropdownLink,
//   List,
//   StyledDropdownPane,
// } from '../../Datatable/Dropdown/DropdownPane';

const SearchSuggestionsPane = styled(StyledDropdownPane)`
  min-width: 100%;
  // z-index: ${getDepth("dropdown")};
`;

const SearchSuggestionsLink = styled(DropdownLink)`
  width: 100%;
`;

const SearchSuggestions = ({
  suggestions,
  onClickOut,
  renderSearchSuggestion,
}) => {
  const searchSuggestionsPaneRef = useOuterClick(onClickOut);

  return (
    <SearchSuggestionsPane ref={searchSuggestionsPaneRef}>
      <List>
        {suggestions.map((suggestion) => {
          return (
            isNotNull(suggestion) && (
              <li key={suggestion.name}>
                <SearchSuggestionsLink
                  name={suggestion.name}
                  onClick={suggestion.onClick}
                >
                  {renderSearchSuggestion(suggestion)}
                </SearchSuggestionsLink>
              </li>
            )
          );
        })}
      </List>
    </SearchSuggestionsPane>
  );
};

SearchSuggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  renderSearchSuggestion: PropTypes.func.isRequired,
  onClickOut: PropTypes.func.isRequired,
};

export default SearchSuggestions;
