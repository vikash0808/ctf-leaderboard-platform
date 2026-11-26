const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_CONNSTRING;
const sessionSecret = process.env.SESSION_SECRET;
const frontendUri = process.env.FRONTEND_URI || "http://localhost:3000";

if (!mongoUri || !sessionSecret) {
  console.error(
    "Missing required environment variables: MONGODB_CONNSTRING and SESSION_SECRET. " +
      "Copy backEnd/.env.example to backEnd/.env and populate your values."
  );
  process.exit(1);
}

const bodyparser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const setup = require("./setup.js");
const userRouter = require("./routes/userRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");
const globalRouter = require("./routes/globalRoutes.js");
const users = require("./models/userModel.js");

mongoose
  .connect(mongoUri, {
    authSource: process.env.MONGODB_AUTH_SOURCE || "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });

db.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

db.once("open", async function () {
  console.log("Database Connected successfully");
  try {
    await setup.setupDB();
  } catch (err) {
    console.error("Database setup error:", err.message);
  }
});

// Body-parser & NoSQL-injection sanitization middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(mongoSanitize());

const sess = {
  store: MongoStore.create({
    mongoUrl: mongoUri,
    touchAfter: 24 * 3600,
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
  },
};

// Trust Proxy to be able to read X-Forwarded-For (user IPs)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sess.proxy = true;
  if (process.env.COOKIE_SECURE === "true") {
    sess.cookie.secure = true;
  }
}

app.use(session(sess));

// CORS headers & preflight handling
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", frontendUri);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Set-Cookie, X-Requested-With, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(
  fileUpload({
    limits: {
      fileSize: 100000000, // 100MB
    },
    createParentPath: true,
  })
);

async function checkAuth(req, res, next) {
  try {
    if (!req.session || !req.session.userId || !req.session.key) {
      return res.send({ state: "sessionError" });
    }
    const user = await users.findById(req.session.userId);
    if (!user || user.key !== req.session.key) {
      return res.send({ state: "sessionError" });
    }
    if (user.isAdmin) {
      req.isAdmin = true;
    }
    return next();
  } catch (err) {
    console.error("Auth check failed:", err.message);
    return res.status(500).send({ state: "error" });
  }
}

async function checkAdminAuth(req, res, next) {
  try {
    if (!req.session || !req.session.userId || !req.session.key) {
      return res.send({ state: "sessionError" });
    }
    const user = await users.findById(req.session.userId);
    if (!user || user.key !== req.session.key || !user.isAdmin) {
      return res.send({ state: "sessionError" });
    }
    req.isAdmin = true;
    return next();
  } catch (err) {
    console.error("Admin auth check failed:", err.message);
    return res.status(500).send({ state: "error" });
  }
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api", globalRouter);
app.use("/api/user", checkAuth, userRouter);
app.use("/api/admin", checkAdminAuth, adminRouter);

app.use("/api/assets", express.static("./assets"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

app.listen(port, () => {
  console.log(`CTF Leaderboard Backend listening on port ${port}`);
});
