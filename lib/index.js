const memoize = require("fast-memoize");

const Lexer = require("./lexer");
const Parser = require("./parser");
const Visitor = require("./visitor");

/**
 * Parse a signature.
 *
 * @param {String} input The signature string.
 * @return {Object} The signature syntax tree.
 */
function parse(input) {
  const lexer = new Lexer();
  const lexResult = lexer.tokenize(input);

  if (lexResult.errors.length > 0) {
    throw new Error(lexResult.errors[0].message);
  }

  const parser = new Parser(lexResult.tokens);
  const cst = parser.signature();

  if (parser.errors.length > 0) {
    throw new Error(parser.errors[0].message);
  }

  const visitor = new Visitor();
  const ast = visitor.visit(cst);

  return ast;
}

/**
 * Match a signature.
 *
 * @param {Object} ast The signature syntax tree.
 * @param {Object} argv The parsed command object (from [yargs-parser](https://www.npmjs.com/package/yargs-parser), for example).
 * @return {?Object} The matched arguments.
 */
function match(ast, argv) {
  const matches = {};

  for (const [index, token] of ast.parameters.entries()) {
    const value = argv._[index];

    if (token.type === "word") {
      if (token.value !== value) {
        return null;
      }
    }

    if (token.type === "argument") {
      if (value) {
        matches[token.name] = token.variadic ? argv._.slice(index) : value;
      } else if (token.required) {
        return null;
      }
    }
  }

  return matches;
}

module.exports = {
  parse: memoize(parse),
  match: memoize(match),
};
