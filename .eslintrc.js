// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    jest: true, // 👈 Esto indica que usas Jest
  },
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
      },
    ],
    quotes: ["off"],
  },
  ignorePatterns: ["/dist/*"],
};
