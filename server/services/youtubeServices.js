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
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", `${query} tutorial`);
    url.searchParams.append("maxResults", "5");
    url.searchParams.append("type", "video");
    url.searchParams.append("key", process.env.YOUTUBE_API_KEY || "");

    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`YouTube API Search Error: ${errText}`);
    }
    const data = await response.json();
    const items = data.items;

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
    console.error("YouTube Error:", error.message);
    return DEFAULT_VIDEO;
  }
};

export const getPlaylistVideos = async (playlistIdOrUrl) => {
  try {
    let playlistId = playlistIdOrUrl;
    const match = playlistIdOrUrl.match(/[&?]list=([^&]+)/);
    if (match && match[1]) {
      playlistId = match[1];
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("playlistId", playlistId);
    url.searchParams.append("maxResults", "50");
    url.searchParams.append("key", process.env.YOUTUBE_API_KEY || "");

    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = "Failed to fetch playlist items";
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.error?.message || errMsg;
      } catch (e) {}
      throw new Error(errMsg);
    }

    const data = await response.json();
    const items = data?.items || [];
    return items.map((item) => {
      const snippet = item.snippet || {};
      const thumbnails = snippet.thumbnails || {};
      const videoId = snippet.resourceId?.videoId || "";
      return {
        videoId,
        title: snippet.title || "",
        description: snippet.description || "",
        thumbnails: {
          default: thumbnails.default?.url || "",
          medium: thumbnails.medium?.url || "",
          high: thumbnails.high?.url || "",
        },
      };
    });
  } catch (error) {
    console.error("YouTube Playlist Error:", error.message);
    throw new Error(error.message || "Failed to fetch playlist items");
  }
};
