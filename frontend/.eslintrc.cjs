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
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "prettier",
    "react-refresh",
    "import",
  ],
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
    "import/default": DISABLED,
    "import/named": DISABLED,
    "import/namespace": DISABLED,
    "import/newline-after-import": WARNING,
    "import/no-named-as-default": DISABLED,
    "import/no-named-as-default-member": DISABLED,
    "import/no-unresolved": DISABLED,
    "import/order": [
      WARNING,
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        pathGroups: [
          {
            pattern: "@components/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal", "external", "builtins"],
        groups: ["builtin", "external", "parent", "sibling", "index"],
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
};
