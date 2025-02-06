const fs = require("fs").promises;
const path = require("path");
const parseCSV = require("csv-parse/sync");

/**
 * Load CSV files, parse them, and generate JSON files for localization.
 * @param {string} configPath - Path to the configuration file.
 * @param {string} currentDir - Path to the root folder.
 */
async function loadCsv(configPath, currentDir) {
  const { exportPath, tabsUrl, localesKey } = require(configPath);

  console.log("[+] IMPORTING LOCALES");

  try {
    const fetch = (await import("node-fetch")).default;

    const responses = await Promise.all(
      tabsUrl.map(async (urltab) => {
        const response = await fetch(urltab);
        return await response.text();
      }),
    );

    const resolvedExportPath = path.resolve(currentDir, exportPath);

    const rows = responses.flatMap((response) => getParsedCSV(response));
    await handleResponse(localesKey, rows, resolvedExportPath);
  } catch (error) {
    console.error("Error fetching or processing CSV files:", error);
  }
}

/**
 * Parse a CSV string into an array of objects.
 * @param {string} file - CSV file content as a string.
 * @returns {Object[]} Parsed CSV data.
 */
function getParsedCSV(file) {
  return parseCSV.parse(file, {
    columns: (header) => header.map((col) => col.split(" ")[0].toLowerCase()),
  });
}

/**
 * Handle the parsed CSV data and generate JSON files for each locale.
 * @param {string[]} localesKey - Array of locale keys.
 * @param {Object[]} rows - Parsed CSV data.
 * @param {string} exportPath - Path to export JSON files.
 */
async function handleResponse(localesKey, rows, exportPath) {
  await localesKey.forEach(async (localeKey) => {
    const content = writeTranslation(localesKey, rows, localeKey);
    await createJson(exportPath, localeKey, `{\n${content}\n}\n`);
  });
}

/**
 * Write translation content for a specific locale.
 * @param {string[]} localesKey - Array of locale keys.
 * @param {Object[]} rows - Parsed CSV data.
 * @param {string} locale - Current locale key.
 * @returns {string} Translation content as a JSON string.
 */
function writeTranslation(localesKey, rows, locale) {
  const fallback =
    localesKey[(localesKey.indexOf(locale) + 1) % localesKey.length];

  return rows
    .map((row) => {
      let { key } = row;
      if (!key) return;

      key = key.replace(/\s+/g, "");

      const newRow =
        row[locale]?.replace(/"/g, "'").replace(/(?:\r\n|\r|\n)/g, "<br>") ||
        row[fallback];

      return newRow ? `  "${key}": "${newRow}"` : undefined;
    })
    .filter(Boolean)
    .join(",\n");
}

/**
 * Create a JSON file with the given content.
 * @param {string} exportPath - Path to export JSON files.
 * @param {string} locale - Locale key.
 * @param {string} content - JSON content as a string.
 */
async function createJson(exportPath, locale, content) {
  try {
    const filePath = `${exportPath}/${locale}.json`;
    await fs.writeFile(filePath, content);
    console.log(`JSON in ${locale} is saved.`);
  } catch (error) {
    console.error(`Error saving JSON for ${locale}:`, error);
  }
}

module.exports = loadCsv;
