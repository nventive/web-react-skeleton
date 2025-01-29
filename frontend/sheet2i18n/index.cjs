"use strict";

const path = require("path");
const sheet2i18n = require("./sheet2i18n.cjs");

const [, , configPathArg] = process.argv;

const configPath = configPathArg || "sheet2i18n.config";
const currentDir = process.cwd();
const resolvedConfigPath = path.resolve(currentDir, configPath);

try {
  sheet2i18n(resolvedConfigPath, currentDir);
} catch (error) {
  console.error(
    `Failed to execute sheet2i18n with config path: ${resolvedConfigPath}`,
  );
  console.error(error);
  process.exit(1);
}
