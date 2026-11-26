const crypto = require("crypto");
const ctfConfig = require("./models/ctfConfigModel.js");
const theme = require("./models/themeModel.js");
const users = require("./models/userModel.js");
const encryptionController = require("./controllers/encryptionController.js");

function generatePassword(length) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@";
  const bytes = crypto.randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters[bytes[i] % characters.length];
  }
  return password;
}

exports.setupDB = async function () {
  const startTimeConfig = await ctfConfig.findOne({ name: "startTime" });

  if (!startTimeConfig) {
    await ctfConfig.create({
      name: "startTime",
      value: new Date().getTime(),
    });
  }

  const endTimeConfig = await ctfConfig.findOne({ name: "endTime" });

  if (!endTimeConfig) {
    await ctfConfig.create({
      name: "endTime",
      value: new Date().getTime(),
    });
  }

  const rulesConfig = await ctfConfig.findOne({ name: "rules" });

  if (!rulesConfig) {
    await ctfConfig.create({
      name: "rules",
      value: [
        {
          text: "- Don't share flags, or share info with other teams!",
        },
        {
          text: "- Don't DDoS our services or bruteforce any flags/websites",
        },
      ],
    });
  }

  const notificationsConfig = await ctfConfig.findOne({
    name: "notifications",
  });

  if (!notificationsConfig) {
    await ctfConfig.create({
      name: "notifications",
      value: [{ message: "Welcome to CTF Leaderboard!", type: "admin", seenBy: [] }],
    });
  }

  const sponsorsConfig = await ctfConfig.findOne({ name: "sponsors" });

  if (!sponsorsConfig) {
    await ctfConfig.create({
      name: "sponsors",
      value: [
        {
          image:
            "https://www.offensive-security.com/wp-content/themes/OffSec/assets/images/offsec-logo.svg",
        },
      ],
    });
  }

  const currentTheme = await theme.findOne({});
  if (!currentTheme) {
    await theme.create({
      color_1: "#ff3d3d",
      color_2: "#ff7070",
      bg_img: "",
      top1_icon: "",
      top2_icon: "",
      top3_icon: "",
    });
  }

  const adminExists = await users.findOne({ isAdmin: true });

  if (!adminExists) {
    const rawPassword = generatePassword(14);
    const password = await encryptionController.encrypt(rawPassword);

    await users.create({
      username: "admin",
      password: password,
      email: "admin@admin.com",
      verified: true,
      key: "none",
      isAdmin: true,
    });
    console.log(`Created default admin. admin:${rawPassword} (CHANGE/DELETE ASAP)`);
  }

  const tagsConfig = await ctfConfig.findOne({ name: "tags" });

  if (!tagsConfig) {
    await ctfConfig.create({
      name: "tags",
      value: ["web", "crypto", "reverse", "pwn", "forensics"],
    });
  }

  const tagColorsConfig = await ctfConfig.findOne({
    name: "tagColors",
  });

  if (!tagColorsConfig) {
    await ctfConfig.create({
      name: "tagColors",
      value: [
        { name: "web", color: "#ef121b94" },
        { name: "osint", color: "#b017a494" },
        { name: "reverse", color: "#17b06b94" },
        { name: "pwn", color: "#00d5ff94" },
        { name: "forensics", color: "#0f329894" },
        { name: "misc", color: "#ffff00c4" },
        { name: "crypto", color: "#9966ff94" },
      ],
    });
  }

  const dynamicScoringConfig = await ctfConfig.findOne({
    name: "dynamicScoring",
  });

  if (!dynamicScoringConfig) {
    await ctfConfig.create({
      name: "dynamicScoring",
      value: false,
    });
  }

  const scoreboardHiddenConfig = await ctfConfig.findOne({
    name: "scoreboardHidden",
  });

  if (!scoreboardHiddenConfig) {
    await ctfConfig.create({
      name: "scoreboardHidden",
      value: false,
    });
  }

  const dockerLimitConfig = await ctfConfig.findOne({ name: "dockerLimit" });

  if (!dockerLimitConfig) {
    await ctfConfig.create({
      name: "dockerLimit",
      value: 1,
    });
  }

  const socialLinksConfig = await ctfConfig.findOne({ name: "socialLinks" });

  if (!socialLinksConfig) {
    await ctfConfig.create({
      name: "socialLinks",
      value: [{ link: "https://github.com", icon: "github" }],
    });
  }

  const userCategoriesConfig = await ctfConfig.findOne({ name: "userCategories" });

  if (!userCategoriesConfig) {
    await ctfConfig.create({
      name: "userCategories",
      value: ["Student", "Other"],
    });
  }

  console.log("Database Setup successfully");
};
