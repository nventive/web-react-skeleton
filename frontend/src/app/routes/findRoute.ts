import routes from "@routes/routes";

const findRoute = (path: string, locale: string): string => {
  let segmentValues: Array<string> = [];
  let segmentNames: Array<string> = [];

  const route = routes.find((route) => {
    return Object.values(route.paths).some((pattern) => {
      segmentNames = (pattern.match(/:([^\s/]+)/g) || []).map((s) =>
        s.substring(1),
      );

      const regexPattern = pattern.replace(/:[^\s/]+/g, "([\\w-]+)");
      const regex = new RegExp(`^${regexPattern}$`);

      if (regex.test(path)) {
        const match = path.match(regex);
        if (match) {
          segmentValues = match.slice(1);
        }
        return true;
      }
      return false;
    });
  });

  if (!route) {
    return path;
  }

  let newPath = route.paths[locale];
  segmentNames.forEach((segmentName, index) => {
    newPath = newPath.replace(`:${segmentName}`, segmentValues[index] || "");
  });

  return newPath;
};

export default findRoute;
