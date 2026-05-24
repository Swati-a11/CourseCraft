import axios from "axios";

const SAFE_VIDEOS = {
  javascript: "https://www.youtube.com/embed/W6NZfCO5SIk",
  react: "https://www.youtube.com/embed/Tn6-PIqc4UM",
  python: "https://www.youtube.com/embed/rfscVS0vtbw",
  java: "https://www.youtube.com/embed/grEKMHGYyns",
  html: "https://www.youtube.com/embed/pQN-pnXPaVg",
  css: "https://www.youtube.com/embed/1PnVor36_40",
  node: "https://www.youtube.com/embed/TlB_eWDSMt4",
  express: "https://www.youtube.com/embed/L72fhGm1tfE",
  mongodb: "https://www.youtube.com/embed/ofme2o29ngU",
  sql: "https://www.youtube.com/embed/HXV3zeQKqGY",
  dsa: "https://www.youtube.com/embed/RBSGKlAvoiM",
  array: "https://www.youtube.com/embed/QJNwK2uJyGs",
  linkedlist: "https://www.youtube.com/embed/NobHlGUjV3g",
  stack: "https://www.youtube.com/embed/F1F2imiOJfk",
  queue: "https://www.youtube.com/embed/XuCbpw6Bj1U",
  tree: "https://www.youtube.com/embed/oSWTXtMglKE",
  graph: "https://www.youtube.com/embed/tWVWeAqZ0WU",
  algorithm: "https://www.youtube.com/embed/8hly31xKli0",
};

const DEFAULT_VIDEO =
  "https://www.youtube.com/embed/RBSGKlAvoiM";

export const searchYouTubeVideo = async (query) => {
  try {
    const lowerQuery = query.toLowerCase();

    // FIRST: use guaranteed working videos
    for (const keyword in SAFE_VIDEOS) {
      if (lowerQuery.includes(keyword)) {
        return SAFE_VIDEOS[keyword];
      }
    }

    // SECOND: YouTube API fallback
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${query} tutorial`,
          maxResults: 5,
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = response.data.items;

    if (!items || items.length === 0) {
      return DEFAULT_VIDEO;
    }

    const validItem = items.find(
      (item) => item?.id?.videoId
    );

    if (!validItem) {
      return DEFAULT_VIDEO;
    }

    return `https://www.youtube.com/embed/${validItem.id.videoId}`;
  } catch (error) {
    console.error(
      "YouTube Error:",
      error.response?.data || error.message
    );

    return DEFAULT_VIDEO;
  }
};
