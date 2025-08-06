export const getBreadcrumbPath = (directory) => {
  if (!directory || directory.length === 0) return "/";
  const path = directory.map((dir) => dir.name).join("/");
  return `/${path}`;
};
