const DISABLED = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks", "prettier", "react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      WARNING,
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": DISABLED,
    "@typescript-eslint/camelcase": DISABLED,
    "@typescript-eslint/no-unsafe-call": DISABLED,
    "@typescript-eslint/no-unsafe-return": DISABLED,
    "@typescript-eslint/no-unsafe-argument": DISABLED,
    "@typescript-eslint/no-unsafe-member-access": DISABLED,
    "@typescript-eslint/no-unsafe-assignment": DISABLED,
    "no-unused-expressions": WARNING,
    "@typescript-eslint/no-unused-vars": WARNING,
    "react-hooks/exhaustive-deps": WARNING,
    "react-hooks/rules-of-hooks": ERROR,
    eqeqeq: ERROR,
    "@typescript-eslint/array-type": [WARNING, { default: "array-simple" }],
    // With Pigment CSS, the SX property is now available on html elements
    "react/no-unknown-property": ["error", { ignore: ["sx"] }],
    // "sort-keys": WARNING,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.eslint.json", "./src/material-ui-pigment-css.d.ts"],
    tsconfigRootDir: __dirname,
  },
};
