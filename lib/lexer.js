const chevrotain = require("chevrotain");
const tokens = require("./tokens");

class Lexer extends chevrotain.Lexer {
  constructor() {
    super(Object.values(tokens));
  }
}

module.exports = Lexer;
