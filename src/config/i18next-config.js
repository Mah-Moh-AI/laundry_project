// npm
const npmPackages = require("../utils/npmPackages");

const { i18nextMiddleware, i18next } = npmPackages;

// Configure i18next
module.exports = i18next.use(i18nextMiddleware.LanguageDetector).init({
  fallbackLng: "en", // Default language
  resources: {
    en: { translation: require("../../locales/en.json") },
    fr: { translation: require("../../locales/fr.json") },
    ar: { translation: require("../../locales/ar.json") },
  },
});
