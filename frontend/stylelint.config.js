/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ["dist/**", "build/**", "node_modules/**"],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-prettier/recommended",
  ],
  plugins: ["stylelint-order"],
};
