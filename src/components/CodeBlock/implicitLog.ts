import { findAssignmentEquals } from "./autoRunHarness";


const BLOCK_KEYWORDS =
  /^(const|let|var|function|async\s+function|class|if|else|for|while|switch|try|catch|finally|return|import|export|do|throw|case|default)\b/;


export function withImplicitLog(source: string): string {
  const lines = source.split("\n");

  let i = lines.length - 1;
  for (; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (trimmed === "" || trimmed.startsWith("//") || trimmed.startsWith("/*")) continue;
    break;
  }
  if (i < 0) return source;

  const rawLine = lines[i];
  const indent = rawLine.match(/^\s*/)?.[0] ?? "";


  const commentIndex = rawLine.indexOf("//");
  let codePart = (commentIndex === -1 ? rawLine : rawLine.slice(0, commentIndex)).trim();
  if (codePart.endsWith(";")) codePart = codePart.slice(0, -1).trim();

  const looksLikeContinuationOrBlock = /^[)}\]{]/.test(codePart);

  if (
    codePart === "" ||
    BLOCK_KEYWORDS.test(codePart) ||
    looksLikeContinuationOrBlock ||
    codePart.startsWith("console.") ||
    findAssignmentEquals(codePart) !== -1
  ) {
    return source;
  }

  lines[i] = `${indent}console.log(${codePart});`;
  return lines.join("\n");
}
