const allowedOrigins = [
  "http://localhost:5173",
  "https://course-craft-ten.vercel.app"
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.endsWith(".vercel.app") ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS Access Denied for Origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
};

