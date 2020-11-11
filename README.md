# kickasso

**meet the artist**

[live prod site](https://kksso.co)

### Usage

`npm install` to install dependencies

The rest is standard Create React App

`npm run start` to run and start a dev server

`npm run build` to build the app into `/build`

#### Sheets API

If you are familiar with publishing a Google Sheet, you can simply copy the demo sheet linked above and update the SheetID variable to your newly created one in `GOOGLESHEET_ID` in `.env`.

#### .env

`SASS_PATH=node_modules:src` is to set the root directory for node-sass

`REACT_APP_RELOAD_SHEET_ALWAYS=false`

- **false** to only load the data once and save it to the browser's sessionStorage and grab it locally afterwards. This is to optimize speed for a production-ready data.
- use **true** if the data is not final yet and you want to reload the newest version of the Google Sheet on each refresh

### App Architecture

#### Structure

```
├── index.js
├── NavBar.js
├── Footer.js
├── Intro.js
├── About.js
├── EmailForm
├── JoinForm
├── ImagesCarousel
├── styles/...
└── Sheetr
    ├── Sheetr.js
    ├── AllArticles.js
    ├── Article.js
    ├── ArticleOpen.js
    └── formatDateTime.js
```

#### Routing

The app has standard webpage structure and in `src/index.js` routing is used for the body of the page while the NavBar and Footer are on every page.

The body of the page is either `Intro.js` which is the homepage or `About.js` or `/Sheetr/Sheetr.js` which show the whole program or a specific "article" if the article ID is included in URL, for example https://kksso.co/#/studio/1

