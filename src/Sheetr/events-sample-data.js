const eventsSample = [
  {
    id: "1",
    title: "Post-Internet polemical",
    artists: "artist 1",
    days: "1.5., 2.5.",
    times: "17:00 - 23:00, 17:00 - 20:00",
    categories: "Exhibition, Talk",
    location: "Gallery",
    language: "",
    links: "",
    teaser_image: "small/1.jpg",
    images: "1.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "2",
    title: "Banal hegemonic hierarchical",
    artists: "artist 2",
    days: "2.5. , 3.5 . 4.5.",
    times: "17:00 - 23:00, 17:00 - 20:00, 14:00 - 20:00",
    categories: "Food",
    location: "Garden",
    language: "",
    links: "",
    teaser_image: "small/2.jpg",
    images: "2.jpg",
    teaser_text:
      "Self critical engagement recombinant mediating filters metanarrative urbane. Post-Internet morphology conceptual structures cybernetic indivisibility cultural discourse simultaneity masculine parody.",
    text:
      "Banal hegemonic hierarchical Self critical engagement recombinant mediating filters metanarrative urbane. Post-Internet morphology conceptual structures cybernetic indivisibility cultural discourse simultaneity masculine parody. Pastoral existential crisis agency phenomenal art post-feminist artifice indeterminancy. Physical site critical engagement emotional resonance appropriated visual clichés Lacan post-colonial obsolescence.",
  },
  {
    id: "3",
    title: "Metanarrative aesthetic",
    artists: "artist 2",
    days: "1.5.",
    times: "14:30 - 16:30",
    categories: "Workshop",
    location: "Atelier",
    language: "",
    links: "",
    teaser_image: "small/3.jpg",
    images: "3.jpg",
    teaser_text:
      "Schopenhauer cognitive dissonance cosmologic ascetic architectural. <br /><br /> Archetype temporal/spatial dynamics intermedia subjectivity of experience process-oriented mythologizing conversely ephemeral.",
    text:
      "Metanarrative aesthetic object Schopenhauer cognitive dissonance cosmologic ascetic architectural. Archetype temporal/spatial dynamics intermedia subjectivity of experience process-oriented mythologizing conversely ephemeral. Agency material culture reductive transitory Foucault prosaic conversely inherently subversive. Discourse body politic oeuvre politics of space cognizance semiotics Frankfurt School.",
  },
  {
    id: "4",
    title: "",
    artists: "",
    days: "2.5., 4.5.",
    times: "17:30 - 19:30, 17:30 - 19:30",
    categories: "Workshop, Music, Talk",
    location: "Cinema",
    language: "",
    links: "",
    teaser_image: "small/4.jpg",
    images: "4.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "5",
    title: "",
    artists: "",
    days: "1.5. , 3.5.",
    times: "15:30 - 16:30, 17:30 - 19:30",
    categories: "Film",
    location: "Cinema",
    language: "",
    links: "",
    teaser_image: "small/5.jpg",
    images: "5.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "6",
    title: "",
    artists: "",
    days: "2.5. , 3.5.",
    times: "15:00 - 17:00, 16:30 - 18:30",
    categories: "Food",
    location: "Main Hall",
    language: "",
    links: "",
    teaser_image: "small/6.jpg\n",
    images: "6.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "7",
    title: "",
    artists: "",
    days: "2.5.",
    times: "22:00",
    categories: "Concert, Music",
    location: "Main Hall",
    language: "",
    links: "",
    teaser_image: "small/7.jpg",
    images: "7.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "8",
    title: "",
    artists: "",
    days: "4.5.",
    times: "18:00",
    categories: "Concert, Music",
    location: "Main Hall",
    language: "",
    links: "",
    teaser_image: "small/8.jpg",
    images: "8.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "9",
    title: "",
    artists: "",
    days: "1.5. , 2.5. , 3.5.",
    times: "21:00, 21:00, 21:00",
    categories: "Concert, Music",
    location: "Main Hall",
    language: "",
    links: "",
    teaser_image: "small/9.png",
    images: "9.png",
    teaser_text: "",
    text: "",
  },
  {
    id: "10",
    title: "",
    artists: "",
    days: "2",
    times: "20:00 - 21:10",
    categories: "Performance",
    location: "Silver Stage",
    language: "",
    links: "",
    teaser_image: "small/10.jpg",
    images: "10.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "11",
    title: "",
    artists: "",
    days: "2",
    times: "18:00 - 19:00",
    categories: "Performance, Workshop",
    location: "Silver Stage",
    language: "",
    links: "",
    teaser_image: "small/11.jpg",
    images: "11.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "12",
    title: "",
    artists: "",
    days: "2",
    times: "13:00 - 16:00",
    categories: "Talk",
    location: "Silver Stage",
    language: "",
    links: "",
    teaser_image: "small/12.jpg",
    images: "12.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "13",
    title: "",
    artists: "",
    days: "2",
    times: "16:30 - 17:30",
    categories: "Children Activity, Other",
    location: "Cinema",
    language: "",
    links: "",
    teaser_image: "small/13.jpg",
    images: "13.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "14",
    title: "",
    artists: "",
    days: "2,4",
    times: "13:00 -16:00, 13:00- 16:00",
    categories: "Performance",
    location: "Garden",
    language: "",
    links: "",
    teaser_image: "small/14.jpg",
    images: "14.jpg",
    teaser_text: "",
    text: "",
  },
  {
    id: "15",
    title: "",
    artists: "",
    days: "3",
    times: "16:00 - 19:00",
    categories: "Workshop",
    location: "Cinema",
    language: "",
    links: "",
    teaser_image: "small/15.jpg",
    images: "15.jpg",
    teaser_text: "",
    text: "",
  },
];
