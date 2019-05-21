import React, { ReactNode } from "react"

const escapeRegExpChars = (value: string) =>
  value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

const highlightText = (value: string, query: string) => {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [value];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: ReactNode[] = [];
  while (true) {
    const match = regexp.exec(value);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = value.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(
      <strong key={lastIndex} style={{ color: "hsl(210, 100%, 40%)" }}>
        {match[0]}
      </strong>
    );
  }
  const rest = value.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};

export { highlightText };
