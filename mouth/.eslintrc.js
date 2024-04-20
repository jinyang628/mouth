module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
      webextensions: true // For Chrome extensions, if applicable.
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-essential" // or "plugin:vue/vue3-strongly-recommended" or "plugin:vue/vue3-recommended"
    ],
    parserOptions: {
      parser: "@babel/eslint-parser", // Specifies the parser for JavaScript
      requireConfigFile: false, // Tells @babel/eslint-parser not to look for a Babel config
      ecmaVersion: 2021,
      sourceType: "module" // Allows for the use of ES6 modules
    },
    plugins: [
      "vue"
    ],
    rules: {
      // Custom rules here
    }
  };
  