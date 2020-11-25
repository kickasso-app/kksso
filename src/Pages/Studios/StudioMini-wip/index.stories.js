// YourComponent.stories.js

import React from "react";
import StudioMini from "./index";

// // This default export determines where your story goes in the story list
export default {
  title: "YourComponent",
  component: StudioMini,
};

const Template = (args) => <StudioMini {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
  article: {
    id: "1",
    artist: "Artist Name",
    styles: "painting, xx, yy",
    dates: "21/10/2020 17:00, 03/11/2020 16:00",
    teaserText: "teaser text",
    imageTeaser: "0",
  },
  openStudio: () => {
    console.log("some");
  },
};
//   openStudio{() => {}}};

// Button.stories.js

// import React from 'react';
// import { Button } from './Button';

// export const Primary = () => (
//   <StudioMini
//     article={{
//       id: "1",
//       artist: "Artist Name",
//       styles: "painting, xx, yy",
//       dates: "21/10/2020 17:00, 03/11/2020 16:00",
//       teaserText: "teaser text",
//       imageTeaser: "0",
//     }}
//     openStudio={() => {}}
//   />
// );

// Primary.storyName = "StudioMini";
