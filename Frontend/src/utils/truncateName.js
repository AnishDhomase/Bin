export function truncateBaseName(fullName, maxBaseLen) {
  const dot = fullName.lastIndexOf(".");
  const hasExt = dot > 0 && dot < fullName.length - 1;
  const base = hasExt ? fullName.slice(0, dot) : fullName;
  const ext = hasExt ? fullName.slice(dot) : "";

  if (base.length <= maxBaseLen) {
    return fullName;
  }

  const truncated = base.slice(0, maxBaseLen) + "..." + ext;
  return truncated;
}
