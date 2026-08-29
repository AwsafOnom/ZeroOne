const sharedTheme = require("../../tailwind.config.js");

module.exports = {
  ...sharedTheme,
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
};
