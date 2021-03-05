// import React, { useRef, useState } from "react";
// import PropTypes from "prop-types";
// import styled from "styled-components";

// import { Search, X} from "react-feather";

// // import { isNotEmpty } from 'ramda-adjunct';

// // import { Spinner } from '../../Spinner';
// // import { Input } from '../Input';

// import {
//   Box,
//   Drop,
//   TextInput,
//   Text,
// } from "grommet";

// import SearchSuggestions from "./SearchSuggestions";
// // import { useControlledInput } from '../hooks/useControlledInput';

// const SearchBarWrapper = styled.div`
//   position: relative;
//   width: 100%;
// `;

// const StyledInput = styled(Input)`
//   text-overflow: ellipsis;
// //   ${createPaddingSpacing({ horizontal: 2.5 })};
//   &:focus,
//   &.focus {
//     // ${createPaddingSpacing({ horizontal: 2.45 })};
//   }
// `;

// const SearchBarIcon = styled.div`
//   position: absolute;
//   top: 0;
// //   height: ${getFormStyle("fieldHeight")};
// //   width: ${getFormStyle("fieldHeight")};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const SearchIcon = styled(SearchBarIcon)`
//   left: 0;
// //   ${createPaddingSpacing({ left: 12 / 20 })};
// `;

// const LoadingIcon = styled(SearchBarIcon)`
//   right: 0;
// //   ${createPaddingSpacing({ right: 12 / 20 })};
// `;

// const ClearSearchButton = styled.button`
//   position: absolute;
//   top: 0;
//   left: 0;
// //   height: ${getFormStyle("fieldHeight")};
// //   width: ${getFormStyle("fieldHeight")};
// //   ${createPaddingSpacing({ left: 12 / 20 })};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const SearchBar = ({
//   onSearch,
//   renderSearchSuggestion = renderSuggestionDefault,
//   placeholder,
//   isInvalid = false,
//   isDisabled = false,
//   ...props
// }) => {
//   const searchInputRef = useRef(null);
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchPerformed, setSearchPerformed] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);

//   const [showDrop, setShowDrop] = useState(false);
//   useEffect(() => {
//     setShowDrop(true);
//   }, []);

//   const onChangeQuery = async () => {
//     const queryValue = searchInputRef.current.value;
//     setSearchPerformed(false);

//     if (queryValue.length > 2) {
//       setIsSearching(true);
//       const suggestions = await onSearch(queryValue);
//       setSearchResults(suggestions);
//       setIsSearching(false);
//       setSearchPerformed(true);
//     }
//   };

//   //   const { inputValue: query, onChangeInput, resetValue } = useControlledInput(
//   //     defaultValue,
//   //     onChangeQuery,
//   //   );

//   const maxLength = 100;
//   const isFieldInvalid = isInvalid || query.length > maxLength;

//   const clearSearch = () => {
//     resetValue();
//     setIsSearching(false);
//     setSearchResults([]);
//     setSearchPerformed(false);
//   };

//   return (
//     <SearchBarWrapper>
//       {searchPerformed ? (
//         <ClearSearchButton aria-label="Clear Search" onClick={clearSearch}>
//           <Icon
//             color="graphite2B"
//             name={SSCIconNames.times}
//             type={IconTypes.ssc}
//             hasFixedWidth
//           />
//         </ClearSearchButton>
//       ) : (
//         <SearchIcon aria-label="Search">
//           <Icon
//             color="graphite2B"
//             name={SSCIconNames.search}
//             type={IconTypes.ssc}
//             hasFixedWidth
//           />
//         </SearchIcon>
//       )}

//       <StyledInput
//         ref={searchInputRef}
//         isDisabled={isDisabled}
//         isInvalid={isFieldInvalid}
//         placeholder={placeholder}
//         type="text"
//         value={query}
//         onChange={onChangeInput}
//         ref={targetRef}
//       />
//       {isSearching && (
//         <LoadingIcon>
//           <Spinner
//             borderWidth={2}
//             height={16}
//             verticalMargin={0}
//             width={16}
//             dark
//           />
//         </LoadingIcon>
//       )}

//       {targetRef.current && showDrop  && searchPerformed && isNotEmpty(searchResults) && (
//         // <SearchSuggestions
//         //   renderSearchSuggestion={renderSearchSuggestion}
//         //   suggestions={searchResults}
//         //   onClickOut={() => setSearchPerformed(false)}
//         // />

// <Drop
//             align={{ top: 'bottom', left: 'left' }}
//             target={targetRef.current}
//             onClickOutside={()=>{setShowDrop(false)}}

//           >
//             <Box pad="large">Drop Contents</Box>
//           </Drop>
//       )}

//     </SearchBarWrapper>
//   );
// };

// SearchBar.propTypes = {
//   placeholder: PropTypes.string.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   renderSearchSuggestion: PropTypes.func,
//   isInvalid: PropTypes.bool,
//   isDisabled: PropTypes.bool,
//   defaultValue: PropTypes.string,
// };

// export default SearchBar;

import React, { useCallback, useMemo, useRef, useState } from "react";

// import { Search } from "grommet-icons";
import { Hash, Disc, Search, X } from "react-feather";
import { Box, Text, TextInput } from "grommet";
// import { grommet, ThemeType } from "grommet/themes";
// import { deepMerge } from "grommet/utils";

// Type annotations can only be used in TypeScript files.
// Remove ': ThemeType' if you are not using Typescript.
// const myCustomTheme: ThemeType = deepMerge(grommet, {
//   global: {
//     drop: {
//       background: '#444444',
//       shadowSize: 'medium',
//       extend: `
//           border-bottom-left-radius: 12px;
//           border-bottom-right-radius: 12px;
//           overflow: hidden;
//         `,
//     },
//     elevation: {
//       dark: {
//         medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
//       },
//       light: {
//         medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
//       },
//     },
//     font: {
//       size: '14px',
//       family: 'Arial',
//     },
//     input: {
//       weight: 400,
//     },
//   },
// });
const artistNames = [
  "Friedrike Ruff",
  "Hoa Luo",
  "Youssef Faltas",
  "Partick C",
];
const cityValues = ["Berlin", "Paris", "Brussels", "Prague", "New York"];
const categoryButtons = [
  "Painting",
  "Sculpture",
  "Prints",
  "Mixed Media",
  "Photography",
  "Installation",
  "Video",
  "Sound",
];

const cities = cityValues.map((city) => {
  return { name: city, type: "city" };
});

const categories = categoryButtons.map((cat) => {
  return { name: cat, type: "medium" };
});

const artists = artistNames.map((a) => {
  return { name: a, type: "artist" };
});

const folks = [...artists, ...cities, ...categories];

export const SearchBar = () => {
  const [value, setValue] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestedFolks, setSuggestedFolks] = useState([]);
  const boxRef = useRef();

  const onChange = useCallback((event) => {
    const { value: newValue } = event.target;
    setValue(newValue);

    if (!newValue.trim()) {
      setSuggestedFolks([]);
    } else {
      // simulate an async call to the backend
      setTimeout(() => setSuggestedFolks(folks), 300);
    }
  }, []);

  const onSuggestionSelect = useCallback(
    (event) => setValue(event.suggestion.value),
    []
  );

  const onSuggestionsOpen = useCallback(() => setSuggestionOpen(true), []);
  const onSuggestionsClose = useCallback(() => setSuggestionOpen(false), []);

  const suggestions = useMemo(
    () =>
      suggestedFolks
        .filter(
          ({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) >= 0
        )
        .map(({ name, type }, index, list) => ({
          label: (
            <Box
              direction="row"
              align="center"
              gap="small"
              border={index < list.length - 1 ? "bottom" : undefined}
              pad="small"
            >
              {type === "artist" && <Text color="#222">{name}</Text>}

              {type === "city" && (
                <Text color="#4b4b4b">
                  <Disc size={16} strokeWidth="1" color="#4b4b4b" fill="#fff" />
                  {"  "}
                  {name}{" "}
                </Text>
              )}
              {type === "medium" && (
                <Text color="#4b4b4b">
                  <Hash size={16} strokeWidth="1" color="#4b4b4b" fill="#fff" />
                  {"  "}
                  {name}
                </Text>
              )}
            </Box>
          ),
          value: name,
        })),
    [suggestedFolks, value]
  );

  return (
    <Box align="center" pad={{ vertical: "medium" }}>
      <Box
        ref={boxRef}
        width="large"
        direction="row"
        align="center"
        pad={{ horizontal: "small", vertical: "xsmall" }}
        round="small"
        elevation={suggestionOpen ? "medium" : undefined}
        border={{
          side: "all",
          color: suggestionOpen ? "transparent" : "border",
        }}
        style={
          suggestionOpen
            ? {
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
              }
            : undefined
        }
      >
        {value.length === 0 ? (
          <Search size={24} color="#7fffd4" strokeWidth={2} />
        ) : (
          <X
            onClick={() => {
              setValue("");
            }}
          />
        )}
        <TextInput
          dropTarget={boxRef.current}
          placeholder="Search for a city, medium, or artist "
          plain
          suggestions={suggestions}
          value={value}
          onChange={onChange}
          onSuggestionsOpen={onSuggestionsOpen}
          onSuggestionsClose={onSuggestionsClose}
          onSuggestionSelect={onSuggestionSelect}
        />
      </Box>
    </Box>
  );
};

export default SearchBar;
