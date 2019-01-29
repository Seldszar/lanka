const { createToken, Lexer } = require("chevrotain");

const LeftBracket = createToken({ name: "LeftBracket", pattern: "<" });
const RightBracket = createToken({ name: "RightBracket", pattern: ">" });
const LeftBrace = createToken({ name: "LeftBrace", pattern: "[" });
const RightBrace = createToken({ name: "RightBrace", pattern: "]" });
const Ellipsis = createToken({ name: "Ellipsis", pattern: "..." });
const StringLiteral = createToken({ name: "StringLiteral", pattern: /\w+/ });
const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });

module.exports = {
  WhiteSpace,
  StringLiteral,
  Ellipsis,
  LeftBrace,
  RightBrace,
  LeftBracket,
  RightBracket,
};
